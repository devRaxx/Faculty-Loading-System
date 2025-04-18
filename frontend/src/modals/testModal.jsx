import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button,
    ModalCloseButton,
} from '@chakra-ui/react';
import CourseMaker from '../components/DetailsMaker/CourseMaker';
import { useSemesterContext } from '../hooks/useSemesterContext';
import { useState } from 'react';
const TestModal = ({ isOpen, onClose }) => {
    const {editSchedule} = useSemesterContext()
    const [course, setCourse] = useState(editSchedule.course)
    const [error, setError] = useState(null)
    const [room, setRoom] = useState(editSchedule.room)
    const [faculty, setFaculty] = useState(editSchedule.faculty)
    const [students, setStudents] = useState(editSchedule.students)
    const [remarks, setRemarks] = useState(editSchedule.remarks)
    const [weeklySchedule, setWeeklySchedule] = useState(editSchedule.schedule)
    const [courseType, setCourseType] = useState({ type: "None", status: "None" })

    const commonModalButtonStyle = {
        borderRadius: '50%',
        background: '#035C65',
        cursor: 'pointer',
        borderColor: 'transparent',
        marginTop: '12px',
    };
    return (
        <Modal isOpen={isOpen} size={'3xl'} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent style={{ border: '2px solid #035C65', borderColor: '#035C65' }}>
                <h1 className='text-5xl text-enamelled-jewel font-bold bg-placebo-turquoise border-b-4 mb-4 border-enamelled-jewel rounded-tl-md rounded-tr-md pl-5 py-2'>Edit Schedule:</h1>
                <ModalCloseButton size="sm" style={{ ...commonModalButtonStyle, marginRight: '30px', pointerEvents: 'none', color: '#035C65', }} />
                <ModalCloseButton size="sm" style={{ ...commonModalButtonStyle, marginRight: '60px', pointerEvents: 'none', color: '#035C65', }} />
                <ModalCloseButton size="sm" style={{ ...commonModalButtonStyle, color: 'white', }} />
                <ModalBody >
                    <CourseMaker setMainCourse={setCourse} mainCourse={course} setCourseType={setCourseType} courseType={courseType.type} students={students} setStudents={setStudents} />


                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button variant='ghost'>Secondary Action</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default TestModal