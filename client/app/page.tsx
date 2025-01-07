
export default function Home() {
  return (
    <div>
      <div
        className="mt-2 bg-gray-100 border border-gray-200 text-sm text-gray-800 rounded-lg p-4 dark:bg-white/10 dark:border-white/20 dark:text-white"
        role="alert"
        tabIndex={-1}
        aria-labelledby="hs-soft-color-dark-label"
      >
        <span id="hs-soft-color-dark-label" className="font-bold">
          Dark
        </span>
        alert! You should check in on some of those fields below.
      </div>
      <div
        className="mt-2 bg-gray-50 border border-gray-200 text-sm text-gray-600 rounded-lg p-4 dark:bg-white/10 dark:border-white/10 dark:text-neutral-400"
        role="alert"
        tabIndex={-1}
        aria-labelledby="hs-soft-color-secondary-label"
      >
        <span id="hs-soft-color-secondary-label" className="font-bold">
          Secondary
        </span>
        alert! You should check in on some of those fields below.
      </div>
      <div
        className="mt-2 bg-blue-100 border border-blue-200 text-sm text-blue-800 rounded-lg p-4 dark:bg-blue-800/10 dark:border-blue-900 dark:text-blue-500"
        role="alert"
        tabIndex={-1}
        aria-labelledby="hs-soft-color-info-label"
      >
        <span id="hs-soft-color-info-label" className="font-bold">
          Info
        </span>
        alert! You should check in on some of those fields below.
      </div>
      <div
        className="mt-2 bg-teal-100 border border-teal-200 text-sm text-teal-800 rounded-lg p-4 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500"
        role="alert"
        tabIndex={-1}
        aria-labelledby="hs-soft-color-success-label"
      >
        <span id="hs-soft-color-success-label" className="font-bold">
          Success
        </span>
        alert! You should check in on some of those fields below.
      </div>
      <div
        className="mt-2 bg-red-100 border border-red-200 text-sm text-red-800 rounded-lg p-4 dark:bg-red-800/10 dark:border-red-900 dark:text-red-500"
        role="alert"
        tabIndex={-1}
        aria-labelledby="hs-soft-color-danger-label"
      >
        <span id="hs-soft-color-danger-label" className="font-bold">
          Danger
        </span>
        alert! You should check in on some of those fields below.
      </div>
      <div
        className="mt-2 bg-yellow-100 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500"
        role="alert"
        tabIndex={-1}
        aria-labelledby="hs-soft-color-warning-label"
      >
        <span id="hs-soft-color-warning-label" className="font-bold">
          Warning
        </span>
        alert! You should check in on some of those fields below.
      </div>
      <div
        className="mt-2 bg-white/10 border border-white/10 text-sm text-white rounded-lg p-4"
        role="alert"
        tabIndex={-1}
        aria-labelledby="hs-soft-color-light-label"
      >
        <span id="hs-soft-color-light-label" className="font-bold">
          Light
        </span>
        alert! You should check in on some of those fields below.
      </div>
    </div>
  );
}
