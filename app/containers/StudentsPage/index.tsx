/*
 * StudentsPage
 *
 * This is the page to see a list of students, create a student,
 * update a student, and/or delete a student.
 *
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Modal, { ModalBody, ModalHeader } from './components/Modal';
import { ErrorFields, Filter, Pagination, Sort, Student } from './types';
import {
  createStudent,
  defaultStudent,
  deleteStudent,
  fetchStudents,
  updateStudent,
  validateStudentData,
} from './utils';
import messages from './messages';
import Button from './components/Button';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from './components/Table';
import Input from './components/Input';

export default function StudentsPage() {
  // Page state
  const [students, setStudents] = React.useState<Array<Student>>([]);
  const [totalStudentsCount, setTotalStudentsCount] = React.useState<number>(0);
  const [createStudentModalOpen, setCreateStudentModalOpen] = React.useState<
    boolean
  >(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState<boolean>(false);
  const [studentToDelete, setStudentToDelete] = React.useState<Student>();
  const [newStudent, setNewStudent] = React.useState<Student>();
  const [formErrors, setFormErrors] = React.useState<ErrorFields<Student>>({});
  const [loading, setLoading] = React.useState<boolean>(false);
  const [init, setInit] = React.useState<boolean>(false);
  const [pagination, setPagination] = React.useState<Pagination>({
    limit: 4,
    index: 0,
    pageNum: 1,
  });
  const [sort, setSort] = React.useState<Sort>({
    direction: 'ASC',
    column: 'fullName',
  });
  const [activeFilter, setActiveFilter] = React.useState<Filter>(undefined);

  React.useEffect(() => {
    fetchStudents({ ...pagination, ...sort, filter: activeFilter }).then(
      ({ students, totalCount }) => {
        setStudents(students);
        setTotalStudentsCount(totalCount || 0);
        setInit(true);
      },
    );
  }, [pagination?.pageNum, sort, activeFilter]);

  const handleCreateStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.persist();
    e.preventDefault();
    if (!newStudent) return;
    const studentId = newStudent?._id;

    // set init state
    setLoading(true);
    setFormErrors({});

    // reformat and parse data accordingly
    let parsedData: Student | object = {};
    for (const name in newStudent) {
      let val = newStudent[name];
      if (typeof val === 'string') val = val?.trim();

      if (name === 'age' && !!val) val = +val;
      else if (!val?.length) val = null;
      parsedData[name] = val;
    }

    // validate the data
    let errors = validateStudentData(parsedData as Student);
    if (!!Object.keys(errors)?.length) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    // if here, means data is validated

    let updatedStud: Student;
    if (!!studentId) {
      // update the student in db
      updatedStud = await updateStudent(parsedData as Student);
    } else {
      // create the new student in db
      updatedStud = await createStudent(parsedData as Student);
    }

    if (!!updatedStud) {
      await fetchStudents({ ...pagination, ...sort, filter: activeFilter })
        .then(({ students, totalCount }) => {
          if (!!students?.length) setStudents(students);
          setTotalStudentsCount(totalCount || 0);
        })
        .then(() => {
          setNewStudent(undefined);
          setCreateStudentModalOpen(false);
          setFormErrors({});
        });
    }

    setLoading(false);
  };

  const handleDeleteStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.persist();
    e.preventDefault();
    if (!studentToDelete || !studentToDelete?._id) return;

    setLoading(true);

    const success = await deleteStudent(studentToDelete?._id);
    if (!success) console.error('ERROR deleting student...');

    await fetchStudents({ ...pagination, ...sort, filter: activeFilter })
      .then(({ students, totalCount }) => {
        setStudents(students);
        setTotalStudentsCount(totalCount || 0);
      })
      .then(() => {
        setStudentToDelete(undefined);
        setDeleteModalOpen(false);
        setLoading(false);
      });

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    let newValue: string | number = e.target.value;
    const name: string = e.target.name;
    setNewStudent((prevState: Student) => ({ ...prevState, [name]: newValue }));
  };

  const prevBtnDisabled = pagination?.pageNum === 1;
  const nextBtnDisabled =
    pagination?.pageNum >= totalStudentsCount / pagination?.limit;

  return (
    <div className="bg-stone-200 h-[100dvh] w-full">
      <div className="rounded drop-shadow-sm p-4 bg-white max-w-[1200px] min-w-[900px] overflow-scroll m-auto flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-3xl font-semibold">
            <FormattedMessage {...messages.header} />
          </h1>
          <Button
            className="bg-green-500 text-stone-50 hover:bg-green-500/80"
            onClick={() => {
              setCreateStudentModalOpen(true);
              setNewStudent(defaultStudent);
            }}
            data-testid="openCreateStudentModal"
          >
            Create New Student
          </Button>
        </div>

        {/* FILTERS */}
        <div className="border-b-[1px] border-stone-300 py-4 flex flex-col gap-2">
          <div className="text-[16px] font-medium">Choose a filter:</div>
          <div className="flex flex-row gap-2 items-center">
            <Button
              className={` text-stone-50 ${
                activeFilter === 'age'
                  ? 'bg-orange-500 hover:bg-orange-400'
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
              onClick={() => {
                setActiveFilter(prevState => (!prevState ? 'age' : undefined));
                setPagination(prevState => ({ ...prevState, pageNum: 1 }));
              }}
            >
              {`Age > 20`}
            </Button>
          </div>
        </div>

        {/* STUDENTS TABLE */}
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell
                onClick={() => {
                  setSort(prevState => ({
                    ...prevState,
                    column: 'fullName',
                    direction:
                      sort?.column === 'fullName'
                        ? sort?.direction === 'ASC'
                          ? 'DESC'
                          : 'ASC'
                        : 'ASC',
                  }));
                  setPagination(prevState => ({ ...prevState, pageNum: 1 }));
                }}
              >
                Full Name (Click To Sort)
              </TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Age</TableHeadCell>
              <TableHeadCell>Grade</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!!students?.length ? (
              students?.map((s, i) => {
                return (
                  <TableRow
                    key={s?._id || Math.random()}
                    className={i % 2 !== 0 ? 'bg-stone-100' : ''}
                  >
                    <TableCell>
                      {s?.firstName} {s?.lastName}
                    </TableCell>
                    <TableCell>{s?.email}</TableCell>
                    <TableCell>{s?.age}</TableCell>
                    <TableCell>{s?.grade}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Button
                        className="bg-red-500 hover:bg-red-400 text-stone-50"
                        onClick={() => {
                          setStudentToDelete(s);
                          setDeleteModalOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        className="bg-blue-500 hover:bg-blue-400 text-stone-50"
                        onClick={() => {
                          setNewStudent({ ...s });
                          setCreateStudentModalOpen(true);
                        }}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : !init ? (
              <TableRow>
                <TableCell
                  className="animate-pulse text-xl font-semibold mt-4 text-center"
                  colSpan={5}
                >
                  Loading Students....
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell
                  className="text-xl font-semibold mt-4 text-center"
                  colSpan={5}
                >
                  No Students Created.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        <div className="border-t-[1px] border-stone-300 py-4 flex flex-col justify-center gap-2">
          <div className="flex flex-row justify-center gap-6 items-center">
            <Button
              className={`bg-stone-200 ${
                prevBtnDisabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-stone-100'
              }`}
              disabled={prevBtnDisabled}
              onClick={() => {
                if (prevBtnDisabled) return;
                setPagination(prevState => ({
                  ...prevState,
                  pageNum: prevState.pageNum -= 1,
                }));
              }}
            >
              Prev
            </Button>
            <div className="font-bold">{pagination?.pageNum}</div>
            <Button
              className={`bg-stone-200 ${
                nextBtnDisabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-stone-100'
              }`}
              disabled={nextBtnDisabled}
              onClick={() => {
                if (nextBtnDisabled) return;
                setPagination(prevState => ({
                  ...prevState,
                  pageNum: prevState.pageNum += 1,
                }));
              }}
            >
              Next
            </Button>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 text-[14px] text-stone-600">
            Total Student Count:
            <span className="font-bold">{totalStudentsCount}</span>
          </div>
        </div>
      </div>

      {/* CREATE STUDENT MODAL */}
      <Modal modalOpen={createStudentModalOpen}>
        <ModalHeader
          onClose={() => {
            setCreateStudentModalOpen(false);
            setNewStudent(undefined);
            setFormErrors({});
          }}
        >
          {newStudent?._id ? 'Update Existing Student' : 'Create New Student'}
        </ModalHeader>
        <ModalBody>
          <form
            className="flex flex-col gap-2"
            onSubmit={handleCreateStudent}
            data-testid={'createStudentForm'}
          >
            <div className="flex flex-row gap-2 items-center justify-between">
              <Input
                label="Enter First Name"
                onChange={handleChange}
                name="firstName"
                placeholder="Enter First Name"
                value={newStudent?.firstName || ''}
                errorMsg={formErrors?.firstName || undefined}
                type="text"
                disabled={loading}
                data-testid={'studentFirstName'}
              />
              <Input
                label="Enter Last Name"
                onChange={handleChange}
                name="lastName"
                placeholder="Enter Last Name"
                value={newStudent?.lastName || ''}
                errorMsg={formErrors?.lastName || undefined}
                type="text"
                disabled={loading}
              />
            </div>
            <Input
              label="Enter Email"
              onChange={handleChange}
              name="email"
              placeholder="Enter Email"
              value={newStudent?.email || ''}
              errorMsg={formErrors?.email || undefined}
              type="text"
              disabled={loading}
            />
            <div className="flex flex-row gap-2 items-center justify-between">
              <Input
                label="Enter Age"
                onChange={handleChange}
                name="age"
                placeholder="Enter Age"
                value={newStudent?.age || ''}
                errorMsg={formErrors?.age || undefined}
                type="number"
                disabled={loading}
              />
              <Input
                label="Enter Grade"
                onChange={handleChange}
                name="grade"
                placeholder="Enter Grade"
                value={newStudent?.grade || ''}
                errorMsg={formErrors?.grade || undefined}
                type="text"
                disabled={loading}
              />
            </div>
            <div className="flex flex-row items-center justify-end pt-4">
              <Button
                type="submit"
                className={`
                  bg-green-500 text-stone-50 disabled:cursor-not-allowed
                  ${loading ? 'brightness-75' : 'hover:bg-green-500/80'}
               `}
                disabled={loading}
                data-testid="saveStudentDataBtn"
              >
                {newStudent?._id ? 'Update Student' : 'Create Student'}
              </Button>
              <Button
                className={`
                  bg-gray-100 text-stone-800 disabled:cursor-not-allowed
                  ${loading ? 'brightness-75' : 'hover:bg-stone-50'}
                `}
                disabled={loading}
                onClick={() => {
                  setCreateStudentModalOpen(false);
                  setNewStudent(undefined);
                  setFormErrors({});
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>

      {/* DELETE STUDENT MODAL */}
      <Modal modalOpen={deleteModalOpen}>
        <ModalHeader
          onClose={() => {
            setDeleteModalOpen(false);
            setStudentToDelete(undefined);
          }}
        >
          Delete Student
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleDeleteStudent}>
            <div className="text-[16px]">
              Are you sure you want to delete student, '
              {studentToDelete?.firstName} {studentToDelete?.lastName}?'
            </div>
            <div className="flex flex-row items-center justify-end pt-4">
              <Button
                type="submit"
                className={`
                  bg-red-500 text-stone-50 disabled:cursor-not-allowed
                  ${loading ? 'brightness-75' : 'hover:bg-red-500/80'}
               `}
                disabled={loading}
              >
                Delete Student
              </Button>
              <Button
                className={`
                  bg-gray-100 text-stone-800 disabled:cursor-not-allowed
                  ${loading ? 'brightness-75' : 'hover:bg-stone-50'}
                `}
                disabled={loading}
                onClick={() => {
                  setDeleteModalOpen(false);
                  setStudentToDelete(undefined);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
