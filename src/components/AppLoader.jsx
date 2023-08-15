const AppLoader = () => {
  return (
    <div className="fixed inset-0 z-[999] flex h-full w-full items-center justify-center bg-white">
      <div className="h-16 w-16 animate-spin rounded-full border-t-2 border-gray-900"></div>
    </div>
  );
};

export default AppLoader;
