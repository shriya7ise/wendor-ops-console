import { Injectable, NotFoundException } from '@nestjs/common';
import { AcademySummary, Course } from './interfaces/vendor-academy.interface';
import { MOCK_COURSES } from './vendor-academy.mock';

@Injectable()
export class VendorAcademyService {
  private readonly courses: Course[] = MOCK_COURSES;

  getSummary(): AcademySummary {
    return {
      totalCourses: this.courses.length,
      coursesInProgress: this.courses.filter((c) => c.status === 'In Progress').length,
      completedCourses: this.courses.filter((c) => c.status === 'Completed').length,
      completedLessons: this.courses.reduce((sum, c) => sum + c.lessonsCompleted, 0),
    };
  }

  listCourses() {
    return this.courses;
  }

  getCourse(id: string) {
    const found = this.courses.find((c) => c.id === id);
    if (!found) throw new NotFoundException(`Course ${id} not found`);
    return found;
  }
}
