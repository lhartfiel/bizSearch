const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="flex justify-center items-end w-full py-6 mt-4">
      <p className="text-dark-blue dark:text-white">
        &copy; {currentYear} – Scout It Out
      </p>
    </footer>
  );
};

export { Footer };
