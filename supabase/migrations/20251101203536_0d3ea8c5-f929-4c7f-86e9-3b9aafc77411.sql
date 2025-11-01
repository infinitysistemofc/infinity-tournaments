-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'organizer', 'player');

-- Create enum for tournament status
CREATE TYPE public.tournament_status AS ENUM ('draft', 'registration', 'active', 'completed');

-- Create enum for tournament format
CREATE TYPE public.tournament_format AS ENUM ('elimination', 'groups', 'league', 'swiss');

-- Create enum for platform
CREATE TYPE public.game_platform AS ENUM ('PC', 'Mobile', 'Console');

-- Create enum for stage type
CREATE TYPE public.stage_type AS ENUM ('group', 'bracket', 'league');

-- Create enum for stage status
CREATE TYPE public.stage_status AS ENUM ('pending', 'active', 'completed');

-- Create enum for participant status
CREATE TYPE public.participant_status AS ENUM ('registered', 'confirmed', 'eliminated', 'champion');

-- Create enum for match status
CREATE TYPE public.match_status AS ENUM ('scheduled', 'ongoing', 'completed');

-- Create enum for circuit status
CREATE TYPE public.circuit_status AS ENUM ('draft', 'active', 'completed');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'player',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create games table
CREATE TABLE public.games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  platform game_platform NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tournaments table
CREATE TABLE public.tournaments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE RESTRICT,
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status tournament_status NOT NULL DEFAULT 'draft',
  format tournament_format NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants INTEGER NOT NULL CHECK (max_participants >= 2 AND max_participants <= 1000),
  prize_pool DECIMAL(10,2),
  rules JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_dates CHECK (start_date < end_date)
);

-- Create stages table
CREATE TABLE public.stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  stage_type stage_type NOT NULL,
  "order" INTEGER NOT NULL,
  status stage_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tournament_id, "order")
);

-- Create participants table
CREATE TABLE public.participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_name TEXT,
  seed INTEGER,
  status participant_status NOT NULL DEFAULT 'registered',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tournament_id, user_id)
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_id UUID NOT NULL REFERENCES public.stages(id) ON DELETE CASCADE,
  participant1_id UUID REFERENCES public.participants(id) ON DELETE SET NULL,
  participant2_id UUID REFERENCES public.participants(id) ON DELETE SET NULL,
  match_date TIMESTAMP WITH TIME ZONE,
  status match_status NOT NULL DEFAULT 'scheduled',
  winner_id UUID REFERENCES public.participants(id) ON DELETE SET NULL,
  score_p1 INTEGER,
  score_p2 INTEGER,
  notes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create circuits table
CREATE TABLE public.circuits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  season TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status circuit_status NOT NULL DEFAULT 'draft',
  scoring_rules JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_circuit_dates CHECK (start_date < end_date)
);

-- Create circuit_tournaments table
CREATE TABLE public.circuit_tournaments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  circuit_id UUID NOT NULL REFERENCES public.circuits(id) ON DELETE CASCADE,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL,
  points_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.0,
  UNIQUE(circuit_id, tournament_id)
);

-- Create circuit_stats table (materialized view for performance)
CREATE TABLE public.circuit_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  circuit_id UUID NOT NULL REFERENCES public.circuits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  matches_played INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(circuit_id, user_id)
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  criteria JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_games_slug ON public.games(slug);
CREATE INDEX idx_tournaments_organizer_id ON public.tournaments(organizer_id);
CREATE INDEX idx_tournaments_game_id ON public.tournaments(game_id);
CREATE INDEX idx_tournaments_status ON public.tournaments(status);
CREATE INDEX idx_tournaments_slug ON public.tournaments(slug);
CREATE INDEX idx_stages_tournament_id ON public.stages(tournament_id);
CREATE INDEX idx_stages_order ON public.stages("order");
CREATE INDEX idx_participants_tournament_id ON public.participants(tournament_id);
CREATE INDEX idx_participants_user_id ON public.participants(user_id);
CREATE INDEX idx_participants_status ON public.participants(status);
CREATE INDEX idx_matches_stage_id ON public.matches(stage_id);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_matches_match_date ON public.matches(match_date);
CREATE INDEX idx_circuits_organizer_id ON public.circuits(organizer_id);
CREATE INDEX idx_circuits_slug ON public.circuits(slug);
CREATE INDEX idx_circuit_tournaments_circuit_id ON public.circuit_tournaments(circuit_id);
CREATE INDEX idx_circuit_tournaments_tournament_id ON public.circuit_tournaments(tournament_id);
CREATE INDEX idx_circuit_stats_circuit_id ON public.circuit_stats(circuit_id);
CREATE INDEX idx_circuit_stats_user_id ON public.circuit_stats(user_id);
CREATE INDEX idx_circuit_stats_rank ON public.circuit_stats(rank);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON public.games
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at
  BEFORE UPDATE ON public.tournaments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stages_updated_at
  BEFORE UPDATE ON public.stages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_circuits_updated_at
  BEFORE UPDATE ON public.circuits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  
  -- Assign default player role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'player');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circuits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circuit_tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circuit_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "User roles are viewable by everyone"
  ON public.user_roles FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for games
CREATE POLICY "Games are viewable by everyone"
  ON public.games FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage games"
  ON public.games FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for tournaments
CREATE POLICY "Tournaments are viewable by everyone"
  ON public.tournaments FOR SELECT
  USING (true);

CREATE POLICY "Organizers can create tournaments"
  ON public.tournaments FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'organizer') OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Organizers can update their own tournaments"
  ON public.tournaments FOR UPDATE
  USING (
    auth.uid() = organizer_id OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Organizers can delete their own draft tournaments"
  ON public.tournaments FOR DELETE
  USING (
    (auth.uid() = organizer_id AND status = 'draft') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for stages
CREATE POLICY "Stages are viewable by everyone"
  ON public.stages FOR SELECT
  USING (true);

CREATE POLICY "Tournament organizers can manage stages"
  ON public.stages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.tournaments
      WHERE tournaments.id = stages.tournament_id
        AND (tournaments.organizer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

-- RLS Policies for participants
CREATE POLICY "Participants are viewable by everyone"
  ON public.participants FOR SELECT
  USING (true);

CREATE POLICY "Users can register themselves"
  ON public.participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Tournament organizers can manage participants"
  ON public.participants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.tournaments
      WHERE tournaments.id = participants.tournament_id
        AND (tournaments.organizer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

-- RLS Policies for matches
CREATE POLICY "Matches are viewable by everyone"
  ON public.matches FOR SELECT
  USING (true);

CREATE POLICY "Tournament organizers can manage matches"
  ON public.matches FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.stages
      JOIN public.tournaments ON tournaments.id = stages.tournament_id
      WHERE stages.id = matches.stage_id
        AND (tournaments.organizer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

-- RLS Policies for circuits
CREATE POLICY "Circuits are viewable by everyone"
  ON public.circuits FOR SELECT
  USING (true);

CREATE POLICY "Organizers can create circuits"
  ON public.circuits FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'organizer') OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Organizers can update their own circuits"
  ON public.circuits FOR UPDATE
  USING (
    auth.uid() = organizer_id OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Organizers can delete their own draft circuits"
  ON public.circuits FOR DELETE
  USING (
    (auth.uid() = organizer_id AND status = 'draft') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for circuit_tournaments
CREATE POLICY "Circuit tournaments are viewable by everyone"
  ON public.circuit_tournaments FOR SELECT
  USING (true);

CREATE POLICY "Circuit organizers can manage circuit tournaments"
  ON public.circuit_tournaments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.circuits
      WHERE circuits.id = circuit_tournaments.circuit_id
        AND (circuits.organizer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

-- RLS Policies for circuit_stats
CREATE POLICY "Circuit stats are viewable by everyone"
  ON public.circuit_stats FOR SELECT
  USING (true);

CREATE POLICY "System can update circuit stats"
  ON public.circuit_stats FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for achievements
CREATE POLICY "Achievements are viewable by everyone"
  ON public.achievements FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage achievements"
  ON public.achievements FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_achievements
CREATE POLICY "User achievements are viewable by everyone"
  ON public.user_achievements FOR SELECT
  USING (true);

CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can grant achievements"
  ON public.user_achievements FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));