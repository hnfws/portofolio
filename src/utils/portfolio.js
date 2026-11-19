export const PORTFOLIO_ROLES = {
  developer: {
    label: "Software Developer",
    shortLabel: "Developer",
    titleLines: ["Software", "Developer"],
    words: ["Software Developer", "Application Developer"],
    stack: ["React", "JavaScript", "Laravel", "Supabase"],
  },
  illustrator: {
    label: "Illustrator",
    shortLabel: "Illustrator",
    titleLines: ["Visual", "Illustrator"],
    words: ["Digital Illustrator", "Visual Storyteller"],
    stack: ["Digital Art", "Character Design", "Visual Storytelling"],
  },
};

export const projectMatchesRole = (projectRole, activeRole) =>
  projectRole === "both" ||
  projectRole === activeRole ||
  (!projectRole && activeRole === "developer");

export const certificateMatchesRole = (certificateRole, activeRole) =>
  !certificateRole ||
  certificateRole === "both" ||
  certificateRole === activeRole;
