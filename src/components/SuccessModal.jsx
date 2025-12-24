import './SuccessModal.css';

export function SuccessModal({ isOpen, onClose }) {
    return (
        <div className={`modal-overlay ${isOpen ? 'show' : ''}`}>
            <div className="modal">
                <div className="modal-icon">✓</div>
                <h2 className="modal-title">Course Completed!</h2>
                <p className="modal-text">
                    Congratulations! You've successfully completed all lessons and units.
                </p>
                <button className="btn btn-primary" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}
