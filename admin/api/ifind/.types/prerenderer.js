module.exports = `
enum PRERENDERER_COMMAND {
  start
  stop
}

type PrerendererLogEntry {
  date_time: String
  type: String
  message: String
}
`;
