import { useParams } from 'react-router-dom';

function QnAThread() {
  const { threadId } = useParams();

  return (
    <div>
      Thread #{threadId}
    </div>
  );
}

export default QnAThread;
