import { XCircleIcon } from '@heroicons/react/20/solid';

export default function ErrorMessage({ error }) { // Destructuring the error prop
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="shrink-0">
          <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Username or password are incorrect. Please try again.</h3>
          <div className="mt-2 text-sm text-red-700">
         
              <p>{error}</p>
            
          </div>
        </div>
      </div>
    </div>
  );
}
