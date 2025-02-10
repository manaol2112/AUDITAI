import * as mui from '@mui/material';

export default function ActionPanel({ title, body, buttonLabel, clickAction }) {
    return (
        <div className="bg-white shadow-sm sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6 flex flex-col h-full">
                <div className="sm:flex sm:items-start sm:justify-between">
                    <div className="flex flex-col flex-grow">
                        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                        <div className="mt-2 text-sm text-gray-500">
                            <p>{body}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4 sm:mt-auto sm:flex sm:shrink-0 sm:items-center justify-start">
                    <mui.Button
                        onClick={clickAction}
                        color="primary"
                        variant="contained"
                        sx={{ marginTop: 'auto' }}
                    >
                        {buttonLabel}
                    </mui.Button>
                </div>
            </div>
        </div>
    );
}
