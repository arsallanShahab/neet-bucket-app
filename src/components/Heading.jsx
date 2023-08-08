const Heading = ({ children }) => {
  return (
    <h1 className="w-full max-w-2xl px-10 py-10 text-left font-sora text-5xl font-bold capitalize text-slate-950">
      {children}
    </h1>
  );
};

export default Heading;
