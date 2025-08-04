const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="flex justify-center items-end w-full py-6">
      <p className="text-dark-blue ">&copy; {currentYear} Scout It Out</p>
    </footer>
  );
};

export { Footer };
