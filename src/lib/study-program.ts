import { professionSector, type Profile } from "@/data/profile";
import { isStudyLevel, studyProgramById, type StudyProgram } from "@/data/study-programs";

export function studyProgramFor(profile: Profile): StudyProgram | undefined {
  if (profile.objective !== "Études") return undefined;
  const program = studyProgramById(profile.studyProgramId);
  if (!program) return undefined;
  if (profile.studyLevel && isStudyLevel(profile.studyLevel) && program.level !== profile.studyLevel) {
    return undefined;
  }
  return program;
}

export function studentMember(profile: Profile) {
  const program = studyProgramFor(profile);
  if (!program) return profile.applicant;
  return {
    ...profile.applicant,
    profession: program.profession,
    sector: professionSector[program.profession] ?? profile.applicant.sector,
  };
}

export function studyDeckPills(profile: Profile) {
  if (profile.objective !== "Études") return [];
  const program = studyProgramFor(profile);
  return program ? ["Études", program.name] : ["Études"];
}
