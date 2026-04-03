export default function JProcesso() {
  return (
    <div style={{ width: "100%", height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}>
      <iframe
        src="https://jprocesso.vercel.app/"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block"
        }}
        title="jProcesso"
        allowFullScreen
      />
    </div>
  );
}
