function FloatingButton() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "10px",
        paddingBottom: "40px",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      <iframe
        src="https://ghbtns.com/github-btn.html?user=cirnum&repo=loadtester&type=star&count=true&size=large"
        frameBorder="0"
        scrolling="0"
        width="170"
        height="30"
        title="GitHub"
      />
    </div>
  );
}

export default FloatingButton;
