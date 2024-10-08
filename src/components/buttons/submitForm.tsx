import { useFormStatus } from "react-dom";

import { AiOutlineLoading } from "react-icons/ai";

const SubmitForm: React.FC<{ title: string }> = ({ title }) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:pointer-events-none"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? (
        <AiOutlineLoading className="mx-auto size-5 animate-spin" />
      ) : (
        title
      )}
    </button>
  );
};

export default SubmitForm;
