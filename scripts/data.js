const users = [
  {
    name: 'Alejandro',
    lastname: 'Lopez',
    document_type: 'CC',
    document_number: '16934111',
    phone: '3155875050',
    address: 'Cra 39',
    email: 'admin@sonia.com',
    password: '123456',
    role: 'Administrador',
  },
  {
    name: 'Jader',
    lastname: 'Castro',
    document_type: 'CC',
    document_number: '16934222',
    phone: '3155876060',
    address: 'Calle 39',
    email: 'docente@sonia.com',
    password: '123456',
    role: 'Docente',
  },
  {
    name: 'Giovannis',
    lastname: 'Guerra',
    document_type: 'CC',
    document_number: '16934333',
    phone: '3155877070',
    address: 'Cra 93',
    email: 'estudiante@sonia.com',
    password: '123456',
    role: 'Estudiante',
  },
];

const subjects = [
  {
    name: 'Historia',
  },
];

const grades = [
  {
    name: 'Primero',
  },
];

module.exports = { users, subjects, grades };
