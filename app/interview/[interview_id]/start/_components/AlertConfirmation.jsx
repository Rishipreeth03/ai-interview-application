import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function AlertConfirmation({ children, stopInterview }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <span className="flex items-center gap-2">{children}</span>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl shadow-2xl border border-red-200 bg-white/95 p-8">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
                        ⚠️ End Interview?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-700 mt-2">
                        This action <span className="font-bold text-red-500">cannot be undone</span>. Your interview will be ended, and you will not be able to return to this page.<br />
                        <span className="text-sm text-gray-500 mt-2 block">If you are sure, click <span className="font-semibold text-red-600">End Interview</span>.</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex gap-4 mt-6">
                    <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg shadow transition">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => stopInterview()}
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold px-4 py-2 rounded-lg shadow transition"
                    >
                        End Interview
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AlertConfirmation