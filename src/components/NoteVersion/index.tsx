import { Button } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";

type Props = {
  title: string;
  children: React.ReactNode;
  restoreVersion: () => void;
};
function NoteVersionItem({ title, children, restoreVersion }: Props) {
  return (
    <Accordion.Item eventKey={title}>
      <Accordion.Header>{title}</Accordion.Header>
      <Accordion.Body>
        <div className="d-flex justify-content-end">
          <Button onClick={restoreVersion}>Restore</Button>
        </div>
        {children}
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default NoteVersionItem;
