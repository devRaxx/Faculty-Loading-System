import { useDisclosure } from '@chakra-ui/react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';

const ExportModal = ({onClose, isOpen}) => {
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
                <h1 className='text-5xl text-enamelled-jewel font-bold bg-placebo-turquoise border-b-2 mb-4 border-enamelled-jewel rounded-tl-md rounded-tr-md pl-5 py-2'>Export</h1>
                <ModalCloseButton size="sm" style={{ ...commonModalButtonStyle, marginRight: '30px', pointerEvents: 'none', color: '#035C65', }} />
                <ModalCloseButton size="sm" style={{ ...commonModalButtonStyle, marginRight: '60px', pointerEvents: 'none', color: '#035C65', }} />
                <ModalCloseButton size="sm" style={{ ...commonModalButtonStyle, color: 'white', }} />
                <ModalBody>
                    <p>Welcome to the Export section of the user manual for our application.</p>
                    <p className='underline'>When the System is Empty:</p>
                    <p className='text-justify'>In the absence of any existing files, initiating a new document is simple. Click the button below to add a new document. 
                        A pop-up menu will prompt you to input the Academic Year and Semester, which will also serve as the document's name. 
                        Once filled, press Save to create the document. Alternatively, click Cancel if you prefer not to create a new file.</p>
                </ModalBody>
                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ExportModal;