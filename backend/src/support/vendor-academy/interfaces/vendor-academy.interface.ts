export interface Course {
  id: string;
  title: string;
  category: string;
  lessonsTotal: number;
  lessonsCompleted: number;
  durationMinutes: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export interface AcademySummary {
  totalCourses: number;
  coursesInProgress: number;
  completedCourses: number;
  completedLessons: number;
}
