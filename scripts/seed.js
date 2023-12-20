const { db } = require('@vercel/postgres');
const {
  invoices,
  customers,
  revenue,
  users,
  subjects,
  grades,
  notes,
} = require('./scripts/data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        lastname VARCHAR(50) NOT NULL,
        document_type VARCHAR(5) NOT NULL,
        document_number VARCHAR(50) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address VARCHAR(50) NOT NULL,
        role VARCHAR(50) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, lastname, document_type, document_number, phone, address, role, email, password)
        VALUES (${user.id}, ${user.name}, ${user.lastname}, ${user.document_type}, ${user.document_number}, ${user.phone}, ${user.address}, ${user.role}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedSubjects(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "Subjects" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS subjects (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL
    );
    `;
    console.log(`Created "Subjects" table`);

    // Insert data into the "Subjects" table
    const insertedSubjects = await Promise.all(
      subjects.map(
        (subject) => client.sql`
        INSERT INTO subjects (id, name)
        VALUES (${subject.id}, ${subject.name})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedSubjects.length} subjects`);

    return {
      createTable,
      subjects: insertedSubjects,
    };
  } catch (error) {
    console.error('Error seeding subjects:', error);
    throw error;
  }

}

async function seedGrades(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "Grades" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS grades (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL
    );
    `;
    console.log(`Created "grades" table`);

    // Insert data into the "Grades" table
    const insertedGrades = await Promise.all(
      grades.map(
        (grade) => client.sql`
        INSERT INTO grades (id, name)
        VALUES (${grade.id}, ${grade.name})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedGrades.length} grades`);

    return {
      createTable,
      grades: insertedGrades,
    };
  } catch (error) {
    console.error('Error seeding grades:', error);
    throw error;
  }

}

async function seedNotes(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "Notes" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS notes (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id INT REFERENCES users(id),
      subject_id INT REFERENCES subjects(id),
      note_1 FLOAT NOT NULL CHECK (note_1 >= 0 AND note_1 <= 10),
      note_2 FLOAT NOT NULL CHECK (note_2 >= 0 AND note_2 <= 10),
      note_3 FLOAT NOT NULL CHECK (note_3 >= 0 AND note_3 <= 10)
    );
    `;
    console.log(`Created "notes" table`);

    // Insert data into the "Notes" table
    const insertedNotes = await Promise.all(
      notes.map(
        (note) => client.sql`
        INSERT INTO notes (id, user_id, subject_id, note_1, note_2, note_3)
        VALUES (${note.id}, ${note.user_id}, ${note.subject_id}, ${note.note_1}, ${note.note_2}, ${note.note_3})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedNotes.length} notes`);

    return {
      createTable,
      notes: insertedNotes,
    };
  } catch (error) {
    console.error('Error seeding notes:', error);
    throw error;
  }

}

async function seedAssignmentsStudentGrade(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "assignments_student_grade" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS assignments_student_grade (
      user_id INT REFERENCES users(id),
      grade_id INT REFERENCES grades(id)
    );
    `;
    console.log(`Created "assignments_student_grade" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding assignments_student_grade:', error);
    throw error;
  }

}

async function seedAssignmentsTeacherGradeSubject(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "assignments_teacher_grade_subject" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS assignments_teacher_grade_subject (
      user_id INT REFERENCES users(id),
      subject_id INT REFERENCES subjects(id),
      grade_id INT REFERENCES grades(id)
    );
    `;
    console.log(`Created "assignments_teacher_grade_subject" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error('Error seeding assignments_teacher_grade_subject:', error);
    throw error;
  }

}

async function seedInvoices(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "invoices" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL,
    amount INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    date DATE NOT NULL
  );
`;

    console.log(`Created "invoices" table`);

    // Insert data into the "invoices" table
    const insertedInvoices = await Promise.all(
      invoices.map(
        (invoice) => client.sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      createTable,
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedCustomers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "customers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "customers" table`);

    // Insert data into the "customers" table
    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) => client.sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      createTable,
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedRevenue(client) {
  try {
    // Create the "revenue" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `;

    console.log(`Created "revenue" table`);

    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedSubjects(client);
  await seedGrades(client);
  await seedNotes(client);
  await seedAssignmentsStudentGrade(client);
  await seedAssignmentsTeacherGradeSubject(client);
  await seedCustomers(client);
  await seedInvoices(client);
  await seedRevenue(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
