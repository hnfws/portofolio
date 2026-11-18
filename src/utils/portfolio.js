export const PORTFOLIO_ROLES = {
  developer: {
    label: "Full-Stack Developer",
    shortLabel: "Developer",
    titleLines: ["Full-Stack", "Developer"],
    words: ["Web Developer", "Problem Solver"],
    stack: ["React", "JavaScript", "Node.js", "Supabase"],
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
