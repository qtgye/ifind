const navPillProps = {
  items: Array.from({ length: 30 }).map((item, index) => ({
    label: [
      {
        label: `Test ${index}`,
        language: "en",
      },
    ],
    href: `/test-${index}`,
  })),
};

export default navPillProps;
