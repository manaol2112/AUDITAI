import { CheckCircleIcon } from '@heroicons/react/20/solid'

export default function SuccessAlert({ title, message, btnmsg }) {
  return (
    <div className="rounded-md bg-green-50 p-4">
      <div className="flex">
        <div className="shrink-0">
          <CheckCircleIcon aria-hidden="true" className="size-5 text-green-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">{title}</h3>
          <div className="mt-2 text-sm text-green-700">
            <p>{message}</p>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              <button
                type="button"
                className="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50 focus:outline-hidden"
              >
                {btnmsg}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
