module.exports = {
  important: true,
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        xxs: "0.5rem",
      },
    },
    flex: {
      0.3: "0 1 30%",
      0.7: "0 1 70%",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      background: "#090e11",
      header: "#262d31",
      test: "#ffffff",
      conversation: "#131c21",
      chat: "#075E54",
      text: "#a0cad2",
      black: "#000",
      search: "#33383b",
      blue: "#4285F4",
    },
    minWidth: {
      0: 0,
      app: "48rem",
    },
    maxWidth: {
      body: "72rem",
      message: "30rem",
      conversation: "14rem",
    },
  },
  variants: {
    extend: {
      fontWeight: ["group-hover"],
      animation: ["group-hover"],
      opacity: ["disabled"],
    },
  },
  plugins: [],
};
