// Este archivo contiene definiciones de tipos para los datos..
// Describe la forma de los datos y qué tipo de datos debe aceptar cada propiedad.
// Se definen estos tipos manualmente
export type User = {
  id: string;
  name: string;
  lastname: string;
  document_type: string;
  document_number: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  //En TypeScript, esto se denomina tipo de unión de cadena.
  //Significa que la propiedad "rol" sólo puede ser una de las tres cadenas: 'Administrador','Docente' o 'Estudiante'
  role: 'Administrador' | 'Docente' | 'Estudiante';
};

export type Subject = {
  id: string;
  name: string;
};

export type Grade = {
  id: string;
  name: string;
};

export type Note = {
  id: string;
  user_id: string;
  user_name: string;
  subject_id: string;
  subject_name: string;
  grade_id: string;
  grade_name: string;
  year: number;
  period_1: number;
  period_2: number;
  final: number;
};

export type Student = {
  id: string;
  name: string;
  lastname: string;
};

export type Teacher = {
  id: string;
  name: string;
  lastname: string;
};

export type AssignmentsStudentGrade = {
  id: string;
  user_id: string;
  user_name: string;
  subject_id: string;
  subject_name: string;
  grade_id: string;
  grade_name: string;
  year: number;
};

export type AssignmentsTeacherSubject = {
  id: string;
  user_id: string;
  subject_id: string;
  subject_name: string;
  grade_id: string;
  year: number;
};

export type LatestTeacher = {
  id: string;
  name: string;
  lastname: string;
};

export type LatestStudent = {
  id: string;
  name: string;
  lastname: string;
};
