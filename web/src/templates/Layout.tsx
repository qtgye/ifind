import Header from "components/Header";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main id="root">{children}</main>
    </>
  );
}
