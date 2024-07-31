import * as React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import StudentsPage from '../index';
import { Student } from '../types';
import { IntlProvider } from 'react-intl';
import messages from '../messages';

const mockStudents = [
  {
    _id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    age: 21,
    grade: '14th',
  },
  {
    _id: '2',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    age: 22,
    grade: '15th',
  },
  {
    _id: '3',
    firstName: 'Paul',
    lastName: 'Door',
    email: 'pdoor@example.com',
    age: 55,
    grade: 'Graduated',
  },
  {
    _id: '4',
    firstName: 'Ashley',
    lastName: 'Jones',
    email: 'ash@example.com',
    age: 7,
    grade: '2nd',
  },
  {
    _id: '5',
    firstName: 'Humpty',
    lastName: 'Dumpty',
    email: 'fell@example.com',
    age: 10,
    grade: '4th',
  },
];

let mockCreateResponse = {
  _id: '6',
  firstName: 'Alice',
  lastName: 'Smith',
  email: 'alice@example.com',
  age: 23,
  grade: 'Graduated',
};

// Mock the request utility
jest.mock('utils/request', () => {
  return jest.fn((url, options) => {
    if (url === '/api/students') {
      if (options?.method === 'POST') {
        mockStudents.push(mockCreateResponse);
        return Promise.resolve({ data: mockCreateResponse });
      } else {
        return Promise.resolve({
          data: {
            students: mockStudents,
            totalCount: mockStudents.length,
          },
        });
      }
    }
    if (url.startsWith('/api/students?')) {
      type Params = {
        limit: number;
        index: number;
        pageNum: number;
        column: 'fullName';
        direction: 'ASC' | 'DESC';
        filter: 'age' | undefined;
      };
      const getQueryParams = (url: string): Params => {
        const urlObj = new URL(url, 'http://example.com'); // Provide a base URL for relative URLs
        const params: any = new URLSearchParams(urlObj.search);
        const result = {};

        for (const [key, value] of params.entries()) {
          result[key] = value;
        }

        return result as Params;
      };

      const params: Params = getQueryParams(url);

      const sortAsc = (
        students: Array<Student>,
        direction: 'ASC' | 'DESC' = 'ASC',
      ) => {
        return [...students]?.sort((a, b) => {
          const nameA = `${a.firstName.toLowerCase()} ${a.lastName.toLowerCase()}`;
          const nameB = `${b.firstName.toLowerCase()} ${b.lastName.toLowerCase()}`;
          if (nameA < nameB) return direction === 'ASC' ? -1 : 1;
          if (nameA > nameB) return direction === 'ASC' ? 1 : -1;
          return 0;
        });
      };

      const skip = (+params?.pageNum - 1) * +params?.limit;
      let students = sortAsc(mockStudents, params?.direction);
      students = students.slice(skip, skip + +params?.limit);

      if (params?.filter === 'age') {
        students = students.filter(s => s?.age && s?.age > 20);
      }

      return Promise.resolve({
        data: {
          students: students,
          totalCount: mockStudents.length,
        },
      });
    }
    if (options?.method === 'DELETE') {
      const foundInd = mockStudents.findIndex(
        s => s.firstName === 'Ashley' && s.lastName === 'Jones',
      );
      if (foundInd !== -1) mockStudents.splice(foundInd, 1);
      return Promise.resolve({ success: true });
    }
  });
});

const renderWithIntl = component => {
  return render(
    <IntlProvider locale="en" messages={messages}>
      {component}
    </IntlProvider>,
  );
};

describe('StudentsPage', () => {
  it('renders students table and fetches students on mount', async () => {
    renderWithIntl(<StudentsPage />);
    expect(screen.getByText('Loading Students....')).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText('John Doe')).toBeInTheDocument(),
    );
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('opens create student modal and creates a new student', async () => {
    renderWithIntl(<StudentsPage />);

    // Open the create student modal
    fireEvent.click(screen.getByRole('button', { name: 'Create New Student' }));

    fireEvent.change(screen.getByLabelText('Enter First Name'), {
      target: { value: 'Alice' },
    });
    fireEvent.change(screen.getByLabelText('Enter Last Name'), {
      target: { value: 'Smith' },
    });
    fireEvent.change(screen.getByLabelText('Enter Email'), {
      target: { value: 'alice@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Enter Age'), {
      target: { value: 23 },
    });
    fireEvent.change(screen.getByLabelText('Enter Grade'), {
      target: { value: '1st grade' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Create Student' }));

    // Wait for the mock request to complete and the UI to update
    await waitFor(
      () => {
        expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      },
      { timeout: 3000, interval: 100 },
    );
  });

  it('opens delete student modal and deletes a student', async () => {
    await act(async () => {
      renderWithIntl(<StudentsPage />);
    });

    await waitFor(() =>
      expect(screen.getByText('Ashley Jones')).toBeInTheDocument(),
    );
    // open delete modal
    fireEvent.click(screen.getAllByText('Delete')[1]);
    // confirm delete student
    fireEvent.click(screen.getByRole('button', { name: 'Delete Student' }));

    await waitFor(() =>
      expect(screen.queryByText('Ashley Jones')).not.toBeInTheDocument(),
    );
  });

  it('handles pagination', async () => {
    await act(async () => {
      renderWithIntl(<StudentsPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.queryByText('Paul Door')).not.toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(screen.getByText('Paul Door')).toBeInTheDocument();
    });
  });

  it('handles sorting', async () => {
    await act(async () => {
      renderWithIntl(<StudentsPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.queryByText('Paul Door')).not.toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Full Name (Click To Sort)'));

    await waitFor(() =>
      expect(screen.getByText('Paul Door')).toBeInTheDocument(),
    );
  });

  it('handles filtering', async () => {
    await act(async () => {
      renderWithIntl(<StudentsPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('Humpty Dumpty')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Age > 20' }));

    await waitFor(() => {
      expect(screen.queryByText('Humpty Dumpty')).not.toBeInTheDocument();
    });
  });
});
