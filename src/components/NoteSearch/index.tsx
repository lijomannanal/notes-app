import Form from "react-bootstrap/Form";
import "./style.css";

type Props = {
  onSearch: (text: string) => void;
  text: string;
};
function NoteSearch({ onSearch, text }: Props) {
  return (
    <div className="search-container">
      <Form.Control
        type="text"
        name="searchText"
        placeholder="Search note..."
        value={text}
        onChange={(event) => onSearch(event?.target.value)}
      />
    </div>
  );
}

export default NoteSearch;
