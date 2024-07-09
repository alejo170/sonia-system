import { sql } from '@vercel/postgres';
import {
  User,
  Subject,
  Grade,
  Note,
  AssignmentsStudentGrade,
  AssignmentsTeacherSubject,
  Teacher,
  Student,
  LatestStudent,
  LatestTeacher,
} from './definitions';
import { unstable_noStore as noStore } from 'next/cache';
const ITEMS_PER_PAGE = 6;

export async function fetchCardData() {
  noStore();
  try {
    const teacherCountPromise = sql`SELECT COUNT(*) FROM users WHERE role = 'Docente'`;
    const studentCountPromise = sql`SELECT COUNT(*) FROM users WHERE role = 'Estudiante'`;
    const subjectCountPromise = sql`SELECT COUNT(*) FROM subjects`;
    const gradeCountPromise = sql`SELECT COUNT(*) FROM grades`;

    const data = await Promise.all([
      teacherCountPromise,
      studentCountPromise,
      subjectCountPromise,
      gradeCountPromise,
    ]);

    const numberOfTeachers = Number(data[0].rows[0].count ?? '0');
    const numberOfStudents = Number(data[1].rows[0].count ?? '0');
    const numberOfSubjects = Number(data[2].rows[0].count ?? '0');
    const numberOfGrades = Number(data[3].rows[0].count ?? '0');

    return {
      numberOfTeachers,
      numberOfStudents,
      numberOfSubjects,
      numberOfGrades,
    };
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error('No se pudieron recuperar los datos de la tarjeta.');
  }
}

export async function fetchUsersPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM users
    WHERE
      name ILIKE ${`%${query}%`} OR
      email ILIKE ${`%${query}%`} OR
      role ILIKE ${`%${query}%`}     
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error('No se pudo recuperar el numero de usuarios.');
  }
}

export async function fetchFilteredUsers(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const filteredUsers = await sql<User>`
      SELECT
        id,
        name,
        lastname,
        document_type,
        document_number,
        phone,
        address,
        role,
        email,
        password
      FROM users
      WHERE
        name ILIKE ${`%${query}%`} OR
        lastname ILIKE ${`%${query}%`} OR
        role ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`}
      ORDER BY name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return filteredUsers.rows;
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error('No se pudo recuperar todos los usuarios.');
  }
}

export async function fetchUserById(id: string) {
  noStore();
  try {
    const data = await sql<User>`
      SELECT id, name, lastname, document_type, document_number, phone, address, email, password, role
      FROM users
      WHERE id = ${id};
    `;

    const user = data.rows.map((user) => ({
      ...user,
    }));

    return user[0];
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error('No se pudo recuperar el usuario.');
  }
}

export async function fetchTeachers() {
  noStore();
  try {
    const data = await sql<Teacher>`
      SELECT
        id,
        name,
        lastname
      FROM users
      WHERE role = 'Docente'
      ORDER BY name ASC
    `;

    const teachers = data.rows;
    return teachers;
  } catch (err) {
    console.error('Error en la base de datos:', err);
    throw new Error('No se pudieron recuperar todos los docentes.');
  }
}

export async function fetchStudents() {
  noStore();
  try {
    const data = await sql<Student>`
      SELECT
        id,
        name,
        lastname
      FROM users
      WHERE role = 'Estudiante'
      ORDER BY name ASC
    `;

    const students = data.rows;
    return students;
  } catch (err) {
    console.error('Error en la base de datos:', err);
    throw new Error('No se pudieron recuperar todos los estudiantes.');
  }
}

export async function fetchLatestTeachers() {
  // Se agrega noStore() aquí para evitar que la respuesta se almacene en caché.
  // Esto es equivalente a (..., {cache: 'no-store'}).
  noStore();
  try {
    const data = await sql<LatestTeacher>`
      SELECT name, lastname
      FROM users
      WHERE role = 'Docente'
      ORDER BY name ASC
      LIMIT 3`;

    const latestTeachers = data.rows.map((teachers) => ({
      ...teachers,
    }));
    return latestTeachers;
  } catch (error) {
    console.error('Error en la base de datos: ', error);
    throw new Error('No se pudieron recuperar los últimos docentes.');
  }
}
// Logica para traer los ultimos estudiantes agregados en la aplicación
export async function fetchLatestStudents() {
  noStore();
  try {
    const data = await sql<LatestStudent>`
      SELECT name, lastname
      FROM users
      WHERE role = 'Estudiante'
      ORDER BY name ASC
      LIMIT 3`;

    const latestStudents = data.rows.map((students) => ({
      ...students,
    }));
    return latestStudents;
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error('No se pudieron recuperar los últimos estudiantes.');
  }
}

export async function fetchSubjects() {
  noStore();
  try {
    const data = await sql<Subject>`
      SELECT
        id,
        name
      FROM subjects
      ORDER BY name ASC
    `;

    const subjects = data.rows;
    return subjects;
  } catch (err) {
    console.error('Error en la base de datos:', err);
    throw new Error('No se pudieron recuperar todas las asignaturas.');
  }
}

export async function fetchSubjectsPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM subjects
    WHERE
      name ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error('No se pudieron recuperar el numero de asignaturas.');
  }
}

export async function fetchFilteredSubjects(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const filteredSubjects = await sql<Subject>`
      SELECT
        id,
        name
      FROM subjects
      WHERE
        name ILIKE ${`%${query}%`}
      ORDER BY name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return filteredSubjects.rows;
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error('No se pudieron recuperar las asignaturas.');
  }
}

export async function fetchSubjectById(id: string) {
  noStore();
  try {
    const data = await sql<Subject>`
      SELECT id, name
      FROM subjects
      WHERE id = ${id};
    `;

    const subject = data.rows.map((subject) => ({
      ...subject,
    }));

    return subject[0];
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error('No se pudo recuperar la asignatura.');
  }
}

export async function fetchGrades() {
  noStore();
  try {
    const data = await sql<Grade>`
      SELECT
        id,
        name
      FROM grades
      ORDER BY name ASC
    `;

    const grades = data.rows;
    return grades;
  } catch (err) {
    console.error('Error en la base de datos:', err);
    throw new Error('No se pudieron recuperar todos los grados.');
  }
}

export async function fetchGradesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM grades
    WHERE
      name ILIKE ${`%${query}%`}
    `;
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error('No se pudieron recuperar el numero de grados.');
  }
}

export async function fetchFilteredGrades(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const grades = await sql<Grade>`
      SELECT
        id,
        name
      FROM grades
      WHERE
        name ILIKE ${`%${query}%`}
      ORDER BY name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return grades.rows;
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error('No se pudieron recuperar los grados.');
  }
}

export async function fetchGradeById(id: string) {
  noStore();
  try {
    const data = await sql<Grade>`
      SELECT id, name
      FROM grades
      WHERE id = ${id};
    `;

    const grade = data.rows.map((grade) => ({
      ...grade,
    }));

    return grade[0];
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error('No se pudo recuperar el grado.');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchNotesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM notes
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error('No se pudieron recuperar el numero de notas.');
  }
}

export async function fetchFilteredNotes(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const notes = await sql<Note>`
    SELECT notes.id as id, CONCAT(users.name, ' ', users.lastname) AS user_name, subjects.name AS subject_name, grades.name AS grade_name, assignment_student.year AS year, notes.period_1 AS period_1, notes.period_2 AS period_2, notes.final AS final
    FROM assignment_student, users, subjects,  grades, notes
    WHERE users.id = assignment_student.user_id 
    AND subjects.id = assignment_student.subject_id
    AND grades.id = assignment_student.grade_id
    AND notes.assignment_student_id = assignment_student.id
    AND (users.name ILIKE ${`%${query}%`} OR
    subjects.name ILIKE ${`%${query}%`} OR
    grades.name ILIKE ${`%${query}%`} OR
    assignment_student.year::text ILIKE ${`%${query}%`})
    ORDER BY users.name ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return notes.rows;
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error('No se pudieron recuperar las notas.');
  }
}

export async function fetchNotesByStudent(id: string) {
  noStore();
  try {
    const notesByStudent = await sql<Note>`
    SELECT notes.id AS id, CONCAT(users.name, ' ',users.lastname) AS user_name, subjects.name AS subject_name, grades.name AS grade_name, assignment_student.year AS year, notes.period_1, notes.period_2, notes.final
    FROM users, subjects, grades, notes, assignment_student
    WHERE notes.assignment_student_id = assignment_student.id 
    AND users.id = assignment_student.user_id 
    AND subjects.id = assignment_student.subject_id 
    AND grades.id = assignment_student.grade_id
    AND users.id = ${id} 
    ORDER BY subjects.id ASC
    `;

    return notesByStudent.rows;
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error('No se pudieron recuperar las notas.');
  }
}

export async function fetchNoteById(id: string) {
  noStore();
  try {
    const data = await sql<Note>`
    SELECT notes.id AS id, CONCAT(users.name, ' ',users.lastname) AS user_id, subjects.name AS subject_id, grades.name AS grade_id, assignment_student.year AS year, notes.period_1, notes.period_2, notes.final
    FROM users, subjects, grades, notes, assignment_student
    WHERE notes.assignment_student_id = assignment_student.id 
    AND users.id = assignment_student.user_id 
    AND subjects.id = assignment_student.subject_id 
    AND grades.id = assignment_student.grade_id
    AND notes.id = ${id};
    `;

    const note = data.rows.map((note) => ({
      ...note,
    }));

    return note[0];
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error('No se pudo recuperar la nota.');
  }
}

export async function fetchFilteredAssignmentsStudentGrade(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const studentgrade = await sql<AssignmentsStudentGrade>`
      SELECT assignment_student.id AS id, CONCAT(users.name, ' ', users.lastname) AS user_id, subjects.name AS subject_id, grades.name AS grade_id, assignment_student.year AS year
      FROM users
      INNER JOIN assignment_student ON users.id = assignment_student.user_id
      INNER JOIN grades ON grades.id = assignment_student.grade_id
      INNER JOIN subjects ON subjects.id = assignment_student.subject_id
      WHERE users.role = 'Estudiante'
      AND users.name ILIKE ${`%${query}%`} OR
      grades.name ILIKE ${`%${query}%`} OR
      subjects.name ILIKE ${`%${query}%`} OR
      assignment_student.year::text ILIKE ${`%${query}%`}
      ORDER BY users.name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return studentgrade.rows;
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error(
      'No se pudieron recuperar las asignaciones del estudiante.',
    );
  }
}

export async function fetchAssignmentsStudentGradePages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM users
    INNER JOIN assignment_student ON users.id = assignment_student.user_id
    INNER JOIN grades ON grades.id = assignment_student.grade_id
    WHERE users.role = 'Estudiante'
    AND users.name ILIKE ${`%${query}%`} OR
    grades.name ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error(
      'No se pudieron recuperar el numero de las asignaciones del estudiante.',
    );
  }
}

export async function fetchstudentGradeById(id: string) {
  noStore();
  try {
    const data = await sql<AssignmentsStudentGrade>`
      SELECT id, user_id, grade_id, year
      FROM assignment_student
      WHERE id = ${id};
    `;

    const studentgrade = data.rows.map((studentgrade) => ({
      ...studentgrade,
    }));

    return studentgrade[0];
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error('No se pudieron recuperar la asignaciones del estudiante.');
  }
}

export async function fetchFilteredAssignmentsTeacherSubject(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const teacherSubject = await sql<AssignmentsTeacherSubject>`
      SELECT assignments_teacher_grade_subject.id AS id, CONCAT(users.name, ' ', users.lastname) AS user_id, subjects.name AS subject_id, grades.name AS grade_id, assignments_teacher_grade_subject.year AS year
      FROM assignments_teacher_grade_subject
      INNER JOIN users ON users.id = assignments_teacher_grade_subject.user_id
      INNER JOIN grades ON grades.id = assignments_teacher_grade_subject.grade_id
      INNER JOIN subjects ON subjects.id = assignments_teacher_grade_subject.subject_id
      WHERE users.role = 'Docente'
      AND users.name ILIKE ${`%${query}%`} OR
      grades.name ILIKE ${`%${query}%`} OR
      subjects.name ILIKE ${`%${query}%`} OR
      assignments_teacher_grade_subject.year::text ILIKE ${`%${query}%`}
      ORDER BY users.name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return teacherSubject.rows;
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error('No se pudieron recuperar las asignaciones del docente.');
  }
}

export async function fetchAssignmentsTeacherSubjectPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM users
    INNER JOIN assignments_teacher_grade_subject ON users.id = assignments_teacher_grade_subject.user_id
    INNER JOIN grades ON grades.id = assignments_teacher_grade_subject.grade_id
    WHERE users.role = 'Docente'
    AND users.name ILIKE ${`%${query}%`} OR
    grades.name ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error(
      'No se pudieron recuperar el numero de las asignaciones estudiante - grado.',
    );
  }
}

export async function fetchTeacherSubjectById(id: string) {
  noStore();
  try {
    const data = await sql<AssignmentsTeacherSubject>`
      SELECT id, user_id, subject_id, grade_id, year
      FROM assignments_teacher_grade_subject
      WHERE id = ${id};
    `;

    const teachersSubjects = data.rows.map((teacherSubject) => ({
      ...teacherSubject,
    }));

    return teachersSubjects[0];
  } catch (error) {
    console.error('Error en la base de datos:', error);
    throw new Error('No se pudo recuperar la asignacion docente - asignatura.');
  }
}

export async function fetchGradesStudents() {
  noStore();
  try {
    const data = await sql<AssignmentsStudentGrade>`
    SELECT assignment_student.id AS id, assignment_student.user_id AS user_id, CONCAT(users.name, ' ', users.lastname) AS user_name, subjects.id AS subject_id, subjects.name AS subject_name, grades.id AS grade_id, grades.name AS grade_name, assignment_student.year AS year 
    FROM assignment_student 
    INNER JOIN users ON users.id = assignment_student.user_id 
    INNER JOIN subjects ON subjects.id = assignment_student.subject_id 
    INNER JOIN grades ON grades.id = assignment_student.grade_id
    `;

    const gradesStudents = data.rows;
    return gradesStudents;
  } catch (err) {
    console.error('Error en la base de datos:', err);
    throw new Error(
      'No se pudieron recuperar todas las asignaciones estudiante - grado.',
    );
  }
}

export async function fetchGradesSubjects() {
  noStore();
  try {
    const data = await sql<AssignmentsTeacherSubject>`
      SELECT assignments_teacher_grade_subject.id AS id, subjects.id AS subject_id, subjects.name AS subject_name, grades.id AS grade_id, assignments_teacher_grade_subject.year AS year
      FROM assignments_teacher_grade_subject
      INNER JOIN grades ON grades.id = assignments_teacher_grade_subject.grade_id
      INNER JOIN subjects ON subjects.id = assignments_teacher_grade_subject.subject_id
    `;

    const gradesSubjects = data.rows;
    return gradesSubjects;
  } catch (err) {
    console.error('Error en la base de datos:', err);
    throw new Error(
      'No se pudieron recuperar todas las asignaciones docente - asignatura.',
    );
  }
}
