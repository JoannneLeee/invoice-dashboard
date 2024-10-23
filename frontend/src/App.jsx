import Container from "./components/Container";
import Invoice from "./components/Invoice";
import Stats from "./components/Stats";
function App() {
  return (
    <>
      <Container>
        <Stats/>
        <Invoice/>
      </Container>
    </>
  );
}

export default App;
