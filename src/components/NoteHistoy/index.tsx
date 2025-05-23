import Accordion from "react-bootstrap/Accordion";
import CustomModal from "../CustomModal";
import type { NoteModel, NoteVersion } from "../models/note";
import NoteVersionItem from "../NoteVersion";
import ReactMarkdown from "react-markdown";
import { Container, Row } from "react-bootstrap";
import "./style.css";
import apiClient from "../../utils/api-client";
import { AxiosError } from "axios";
import { Toastvariants } from "../models/common";
import { useLayoutContext } from "../../context/LayoutContext";

type Props = {
  show: boolean;
  versions: NoteVersion[];
  handleClose: () => void;
};
function NoteHistory({ show, versions, handleClose }: Props) {
  const { setToastInfo } = useLayoutContext();
  const onRestoreVersion = async (note: NoteModel) => {
    try {
      const { _id, title, content } = note;
      await apiClient.put(`/notes/${_id}`, {
        title,
        content,
      });
      setToastInfo({
        title: "Success",
        message: `Note version restored successfully`,
        show: true,
        variant: Toastvariants.Success,
      });
    } catch (error) {
      let message = error;
      if (error instanceof AxiosError) {
        message = error.response?.data?.error;
      }
      setToastInfo({
        title: "Error",
        message: `Note version restore failed! ${message}`,
        show: true,
        variant: Toastvariants.Danger,
      });
    }
  };
  return (
    <CustomModal handleClose={handleClose} show={show} title={`Versions`}>
      <Accordion>
        {versions.map((version) => {
          let owner = "-";
          let collaborators = "-";
          if (version.data) {
            owner = version.data.owner.username;
            collaborators = version.data.collaborators
              .map((co) => co.username)
              .join(", ");
          }

          return (
            <NoteVersionItem
              restoreVersion={() => onRestoreVersion(version.data)}
              key={version._id}
              title={`Version ${version.version}`}
            >
              <Container>
                <Row>
                  <div className="item-container">
                    Title
                    <div className="title">{version.data?.title}</div>
                  </div>
                </Row>
                <Row>
                  <div className="preview-container">
                    Content
                    <div className="preview">
                      <ReactMarkdown>{version.data?.content}</ReactMarkdown>
                    </div>
                  </div>
                </Row>
                <Row>
                  <div className="credits">
                    <div>Owner:</div>
                    <div>{owner}</div>
                  </div>
                </Row>
                <Row>
                  <div className="credits">
                    <div>Collaborators:</div>
                    <div>{collaborators}</div>
                  </div>
                </Row>
              </Container>
            </NoteVersionItem>
          );
        })}
      </Accordion>
    </CustomModal>
  );
}

export default NoteHistory;
