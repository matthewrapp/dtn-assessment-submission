import request from 'utils/request';
import { ErrorFields, Filter, Pagination, Sort, Student } from './types';

export const defaultStudent: Student = {
  age: null,
  email: null,
  firstName: '',
  lastName: '',
  grade: null,
  _id: null,
};

export const validateStudentData = (data: Student): ErrorFields<Student> => {
  const errors: ErrorFields<Student> = {};

  if (!data?.firstName || !data?.firstName?.trim()?.length) {
    errors['firstName'] = 'First name is required.';
  }

  if (!data?.lastName || !data?.lastName?.trim()?.length) {
    errors['lastName'] = 'Last name is required.';
  }

  const emailReg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (data?.email && !emailReg.test(data?.email)) {
    errors['email'] = 'Must be a valid email.';
  }

  if (data?.age !== undefined && data?.age !== null) {
    if (data?.age < 0) {
      errors['age'] = 'Age must be a postive number.';
    }
    if (!Number.isInteger(data?.age)) {
      errors['age'] = 'Age must be an integer.';
    }
  }

  return errors;
};

// fetch students utility
export const fetchStudents = async ({
  limit,
  index,
  pageNum,
  direction,
  column,
  filter,
}: Pagination & Sort & { filter: Filter }) => {
  const allStuds: any = await request(
    `/api/students?limit=${limit}&index=${index}&pageNum=${pageNum}&column=${column}&direction=${direction}&filter=${filter}`,
  ).catch(err => {
    console.error('err getting all students', err);
  });
  return allStuds?.data as { students: Array<Student>; totalCount: number };
};

// create student utility
export const createStudent = async (newStudentData: Student) => {
  const stud: any = await request(`/api/students`, {
    method: 'POST',
    body: JSON.stringify(newStudentData),
    headers: {
      'Content-type': 'application/json',
    },
  }).catch(err => {
    console.error('err creating new student', err);
  });
  return stud?.data as Student;
};

// update student utility
export const updateStudent = async (updatedStudentData: Student) => {
  const updatedStud: any = await request(
    `/api/students/${updatedStudentData?._id}`,
    {
      method: 'PUT',
      body: JSON.stringify(updatedStudentData),
      headers: {
        'Content-type': 'application/json',
      },
    },
  ).catch(err => {
    console.error('err deleting student', err);
  });
  return updatedStud?.data as Student;
};

// delete student utility
export const deleteStudent = async (studentId: string) => {
  const resp: any = await request(`/api/students/${studentId}`, {
    method: 'DELETE',
  }).catch(err => {
    console.error('err deleting student', err);
  });
  return resp?.success as boolean;
};
