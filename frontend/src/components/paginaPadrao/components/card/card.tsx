
const Card = ({ children } : any) => {

  return (
    <div className="w-[100%] flex flex-col  gap-5 p-20 overflow-scroll">
        {children}
    </div>
  );
};

export default Card;
