'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { unstable_noStore as noStore } from 'next/cache';

const UserFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Por favor digite un nombre.' }),
  lastname: z.string().min(1, { message: 'Por favor digite un apellido.' }),
  document_type: z.string({
    invalid_type_error: 'Por favor seleccione un tipo de documento.',
  }),
  document_number: z.string().regex(/^[0-9]+$/, {
    message: 'Por favor digite un número de documento válido.',
  }),
  phone: z.string().regex(/^[0-9]+$/, {
    message: 'Por favor digite un número de teléfono válido.',
  }),

  address: z.string().min(1, { message: 'Por favor digite una dirección' }),
  email: z.string().email('Por favor digite un email válido.'),
  password: z.string().min(1, { message: 'Por favor digite un password' }),
  role: z.enum(['Administrador', 'Docente', 'Estudiante'], {
    invalid_type_error: 'Por favor seleccione un rol.',
  }),
});

const SubjectFormSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, { message: 'Por favor digite un nombre para la asignatura.' }),
});

const GradeFormSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, { message: 'Por favor digite un nombre para el grado.' }),
});

const NoteFormSchema = z.object({
  id: z.string(),
  assignment_student_id: z.string(),
  year: z.coerce.number().min(1, { message: 'Por favor seleccione un año' }),
  grade_id: z.string({
    invalid_type_error: 'Por favor seleccione un grado.',
  }),
  subject_id: z.string({
    invalid_type_error: 'Por favor seleccione una asignatura.',
  }),
  user_id: z.string({
    invalid_type_error: 'Por favor seleccione un estudiante.',
  }),
  period_1: z.coerce
    .number()
    .gte(1, { message: 'Por favor digite una nota mayor o igual que 0.' })
    .lte(10, { message: 'Por favor digite una nota menor o igual que 10.' }),

  period_2: z.coerce
    .number()
    .gte(1, { message: 'Por favor digite una nota mayor o igual que 0.' })
    .lte(10, { message: 'Por favor digite una nota menor o igual que 10.' }),
  final: z.coerce.number(),
});

const AssignmentsStudentGradeFormSchema = z.object({
  id: z.string(),
  user_id: z.string({
    invalid_type_error: 'Por favor seleccione un estudiante.',
  }),
  subject_id: z.string({
    invalid_type_error: 'Por favor seleccione una asignatura.',
  }),
  grade_id: z.string({
    invalid_type_error: 'Por favor seleccione un grado.',
  }),
  year: z.coerce.number().min(1, { message: 'Por favor seleccione un año' }),
});

const AssignmentsTeacherSubjectFormSchema = z.object({
  id: z.string(),
  user_id: z.string({
    invalid_type_error: 'Por favor seleccione un Docente.',
  }),
  subject_id: z.string({
    invalid_type_error: 'Por favor seleccione una asignatura.',
  }),
  grade_id: z.string({
    invalid_type_error: 'Por favor seleccione un grado.',
  }),
  year: z.coerce.number().min(1, { message: 'Por favor seleccione un año' }),
});

const CreateUser = UserFormSchema.omit({ id: true, date: true });
const UpdateUser = UserFormSchema.omit({ id: true, date: true });
const CreateSubject = SubjectFormSchema.omit({ id: true, date: true });
const UpdateSubject = SubjectFormSchema.omit({ id: true, date: true });
const CreateGrade = GradeFormSchema.omit({ id: true, date: true });
const UpdateGrade = GradeFormSchema.omit({ id: true, date: true });
const CreateAssignmentsStudentGrade = AssignmentsStudentGradeFormSchema.omit({
  id: true,
  date: true,
});
const UpdateAssignmentsStudentGrade = AssignmentsStudentGradeFormSchema.omit({
  id: true,
  date: true,
});
const CreateAssignmentsTeacherSubject =
  AssignmentsTeacherSubjectFormSchema.omit({ id: true, date: true });
const UpdateAssignmentsTeacherSubject =
  AssignmentsTeacherSubjectFormSchema.omit({ id: true, date: true });
const CreateNote = NoteFormSchema.omit({ id: true, date: true });
const UpdateNote = NoteFormSchema.omit({ id: true, date: true });

export type StateUser = {
  errors?: {
    name?: string[];
    lastname?: string[];
    document_type?: string[];
    document_number?: string[];
    phone?: string[];
    address?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
  };
  message?: string | null;
};

export type StateSubject = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
};

export type StateGrade = {
  errors?: {
    name?: string[];
  };
  message?: string | null;
};

export type StateNote = {
  errors?: {
    assignment_student_id?: string[];
    year?: string[];
    grade_id?: string[];
    subject_id?: string[];
    user_id?: string[];
    period_1?: string[];
    period_2?: string[];
    final?: string[];
  };
  message?: string | null;
};

export type StateAssignmentsStudentGrade = {
  errors?: {
    user_id?: string[];
    subject_id?: string[];
    grade_id?: string[];
    year?: string[];
  };
  message?: string | null;
};

export type StateAssignmentsTeacherSubject = {
  errors?: {
    user_id?: string[];
    subject_id?: string[];
    grade_id?: string[];
    year?: string[];
  };
  message?: string | null;
};

export async function createUser(prevState: StateUser, formData: FormData) {
  // Validando los campos del formulario usando Zod
  const validatedFields = CreateUser.safeParse({
    name: formData.get('name'),
    lastname: formData.get('lastname'),
    document_type: formData.get('document_type'),
    document_number: formData.get('document_number'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
  });
  // Si la validación del formulario falla, devuelva los errores con anticipación. De lo contrario, continúa.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. No se puede crear el usuario.',
    };
  }

  // Preparar datos para insertarlos en la base de datos.
  const {
    name,
    lastname,
    document_type,
    document_number,
    phone,
    address,
    email,
    password,
    role,
  } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insertar datos en la base de datos
  try {
    await sql`
    INSERT INTO users (name, lastname, document_type, document_number, phone, address, email, password, role)
    VALUES (${name}, ${lastname}, ${document_type}, ${document_number}, ${phone}, ${address}, ${email}, ${hashedPassword}, ${role})
    `;
  } catch (error) {
    // Si ocurre un error en la base de datos, devolverá un error más específico
    return {
      message: 'No se puede crear el usuario porque ya existe ese email.',
    };
  }
  // Revalidar el caché de la página de usuarios y redirigir al usuario.
  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}

export async function updateUser(
  id: string,
  prevState: StateUser,
  formData: FormData,
) {
  const validatedFields = UpdateUser.safeParse({
    name: formData.get('name'),
    lastname: formData.get('lastname'),
    document_type: formData.get('document_type'),
    document_number: formData.get('document_number'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. No se puede actualizar el usuario.',
    };
  }

  const {
    name,
    lastname,
    document_type,
    document_number,
    phone,
    address,
    email,
    password,
    role,
  } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await sql`
    UPDATE users
    SET name = ${name}, lastname = ${lastname}, document_type = ${document_type}, document_number = ${document_number}, phone = ${phone}, address = ${address}, email = ${email}, password = ${hashedPassword}, role = ${role}
    WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'No se puede actualizar el usuario porque ya existe ese email.',
    };
  }

  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}

export async function deleteUser(id: string) {
  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
    revalidatePath('/dashboard/users');
    return { message: 'Usuario Eliminado' };
  } catch (error) {
    return {
      message: 'Esta asociado a una asignación',
    };
  }
}

export async function createSubject(
  prevState: StateSubject,
  formData: FormData,
) {
  noStore();
  const validatedFields = CreateSubject.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. No se puede crear la asignatura.',
    };
  }

  const { name } = validatedFields.data;

  try {
    await sql`
    INSERT INTO subjects (name)
    VALUES (${name})
    `;
  } catch (error) {
    return {
      message: 'No se puede crear porque ya existe esa asignatura.',
    };
  }
  revalidatePath('/dashboard/subjects');
  redirect('/dashboard/subjects');
}

export async function updateSubject(
  id: string,
  prevState: StateSubject,
  formData: FormData,
) {
  const validatedFields = UpdateSubject.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. No se puede actualizar la asignatura.',
    };
  }

  const { name } = validatedFields.data;

  try {
    await sql`
    UPDATE subjects
    SET name = ${name}
    WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'No se puede actualizar porque ya existe esa asignatura.',
    };
  }

  revalidatePath('/dashboard/subjects');
  redirect('/dashboard/subjects');
}

export async function deleteSubject(id: string) {
  try {
    await sql`DELETE FROM subjects WHERE id = ${id}`;
    revalidatePath('/dashboard/subjects');
    return { message: 'Asignatura eliminada.' };
  } catch (error) {
    return {
      message: 'Esta asociado a una asignación',
    };
  }
}

export async function createGrade(prevState: StateGrade, formData: FormData) {
  noStore();
  const validatedFields = CreateGrade.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. No se puede crear el grado.',
    };
  }

  const { name } = validatedFields.data;

  try {
    await sql`
    INSERT INTO grades (name)
    VALUES (${name})
    `;
  } catch (error) {
    return { message: 'No se puede crear porque ya existe ese grado.' };
  }
  revalidatePath('/dashboard/grades');
  redirect('/dashboard/grades');
}

export async function updateGrade(
  id: string,
  prevState: StateGrade,
  formData: FormData,
) {
  const validatedFields = UpdateGrade.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. No se puede actualizar el grado.',
    };
  }

  const { name } = validatedFields.data;

  try {
    await sql`
    UPDATE grades
    SET name = ${name}
    WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'No se puede actualizar porque ya existe ese grado.',
    };
  }

  revalidatePath('/dashboard/grades');
  redirect('/dashboard/grades');
}

export async function deleteGrade(id: string) {
  try {
    await sql`DELETE FROM grades WHERE id = ${id}`;
    revalidatePath('/dashboard/grades');
    return { message: 'Grado eliminado.' };
  } catch (error) {
    return { message: 'Esta asociado a una asignación' };
  }
}

export async function createNote(prevState: StateNote, formData: FormData) {
  noStore();

  const validatedFields = CreateNote.safeParse({
    assignment_student_id: formData.get('assignmentStudentId'),
    period_1: formData.get('period_1'),
    period_2: formData.get('period_2'),
    final: formData.get('final'),
    year: formData.get('year'),
    grade_id: formData.get('gradeId'),
    subject_id: formData.get('subjectId'),
    user_id: formData.get('studentId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. No se puede asignar la Nota.',
    };
  }

  const { assignment_student_id, period_1, period_2 } = validatedFields.data;

  try {
    await sql`
    INSERT INTO notes (assignment_student_id, period_1, period_2, final)
    VALUES (${assignment_student_id}, ${period_1}, ${period_2}, ${
      (period_1 + period_2) / 2
    })
    `;
  } catch (error) {
    return {
      message:
        'No se puede asignar porque ese usuario ya tiene nota en esa asignatura.',
    };
  }
  revalidatePath('/dashboard/notes');
  redirect('/dashboard/notes');
}

export async function updateNote(
  id: string,
  prevState: StateNote,
  formData: FormData,
) {
  const validatedFields = UpdateNote.safeParse({
    assignment_student_id: formData.get('assignmentStudentId'),
    period_1: formData.get('period_1'),
    period_2: formData.get('period_2'),
    final: formData.get('final'),
    year: formData.get('year'),
    grade_id: formData.get('gradeId'),
    subject_id: formData.get('subjectId'),
    user_id: formData.get('studentId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. No se puede editar la Nota.',
    };
  }

  const { period_1, period_2 } = validatedFields.data;

  try {
    await sql`
    UPDATE notes
    SET period_1 = ${period_1}, period_2 = ${period_2}, final = ${
      (period_1 + period_2) / 2
    }
    WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message:
        'No se puede editar porque ese usuario ya tiene nota en esa asignatura.',
    };
  }

  revalidatePath('/dashboard/notes');
  redirect('/dashboard/notes');
}

export async function deleteNote(id: string) {
  try {
    await sql`DELETE FROM notes WHERE id = ${id}`;
    revalidatePath('/dashboard/notes');
    return { message: 'Nota eliminada' };
  } catch (error) {
    return { message: 'No se puede eliminar' };
  }
}

export async function createAssignmentsStudentGrade(
  prevState: StateAssignmentsStudentGrade,
  formData: FormData,
) {
  noStore();
  const validatedFields = CreateAssignmentsStudentGrade.safeParse({
    user_id: formData.get('studentId'),
    subject_id: formData.get('subjectId'),
    grade_id: formData.get('gradeId'),
    year: formData.get('year'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message:
        'Campos faltantes. No se puede realizar la asignacion del estudiante.',
    };
  }

  const { user_id, subject_id, grade_id, year } = validatedFields.data;

  try {
    await sql`
    INSERT INTO assignment_student (user_id, subject_id, grade_id, year)
    VALUES (${user_id}, ${subject_id}, ${grade_id}, ${year})
    `;
  } catch (error) {
    return {
      message:
        'No se puede crear porque ya existe ese estudiante en esa asignatura, grado y año.',
    };
  }

  revalidatePath('/dashboard/assignments?tab=Estudiante');
  redirect('/dashboard/assignments?tab=Estudiante');
}

export async function updateAssignmentsStudentGrade(
  id: string,
  prevState: StateAssignmentsStudentGrade,
  formData: FormData,
) {
  const validatedFields = UpdateAssignmentsStudentGrade.safeParse({
    user_id: formData.get('studentId'),
    subject_id: formData.get('subjectId'),
    grade_id: formData.get('gradeId'),
    year: formData.get('year'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message:
        'Campos faltantes. No se puede actualizar la asignacion del estudiante.',
    };
  }

  const { user_id, subject_id, grade_id, year } = validatedFields.data;

  try {
    await sql`
    UPDATE assignment_student 
    SET user_id = ${user_id}, subject_id = ${subject_id}, grade_id = ${grade_id}, year = ${year}
    WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message:
        'No se puede actualizar porque ya existe ese estudiante en esa asignatura, grado y año.',
    };
  }

  revalidatePath('/dashboard/assignments?tab=Estudiante');
  redirect('/dashboard/assignments?tab=Estudiante');
}

export async function deleteAssignmentsStudentGrade(id: string) {
  try {
    await sql`DELETE FROM assignment_student WHERE id = ${id}`;
    revalidatePath('/dashboard/assignments?tab=Estudiante');
    return { message: 'Asignacion estudiante eliminada.' };
  } catch (error) {
    return {
      message: 'Hay nota',
    };
  }
}

export async function createAssignmentsTeacherSubject(
  prevState: StateAssignmentsTeacherSubject,
  formData: FormData,
) {
  noStore();
  const validatedFields = CreateAssignmentsTeacherSubject.safeParse({
    user_id: formData.get('teacherId'),
    subject_id: formData.get('subjectId'),
    grade_id: formData.get('gradeId'),
    year: formData.get('year'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message:
        'Campos faltantes. No se pudo realizar la asignacion del docente.',
    };
  }

  const { user_id, subject_id, grade_id, year } = validatedFields.data;

  try {
    await sql`
    INSERT INTO assignments_teacher_grade_subject (user_id, subject_id, grade_id, year)
    VALUES (${user_id}, ${subject_id}, ${grade_id}, ${year})
    `;
  } catch (error) {
    return {
      message:
        'No se puede crear porque ya existe ese docente en esa asignatura, grado y año.',
    };
  }

  revalidatePath('/dashboard/assignments');
  redirect('/dashboard/assignments');
}

export async function updateAssignmentsTeacherSubject(
  id: string,
  prevState: StateAssignmentsTeacherSubject,
  formData: FormData,
) {
  const validatedFields = UpdateAssignmentsTeacherSubject.safeParse({
    user_id: formData.get('teacherId'),
    subject_id: formData.get('subjectId'),
    grade_id: formData.get('gradeId'),
    year: formData.get('year'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message:
        'Campos faltantes. No se pudo actualizar la asignacion del docente.',
    };
  }

  const { user_id, subject_id, grade_id, year } = validatedFields.data;

  try {
    await sql`
    UPDATE assignments_teacher_grade_subject 
    SET user_id = ${user_id}, subject_id = ${subject_id}, grade_id = ${grade_id}, year = ${year}
    WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message:
        'No se puede actualizar porque ya existe ese docente en esa asignatura, grado y año.',
    };
  }
  revalidatePath('/dashboard/assignments');
  redirect('/dashboard/assignments');
}

export async function deleteAssignmentsTeacherSubject(id: string) {
  try {
    await sql`DELETE FROM assignments_teacher_grade_subject WHERE id = ${id}`;
    revalidatePath('/dashboard/assignments');
    return { message: 'Delete AssignmentsTeacherSubject.' };
  } catch (error) {
    return {
      message: 'No se puede eliminar.',
    };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales no validas.';
        default:
          return 'Algo salió mal.';
      }
    }
    throw error;
  }
}
