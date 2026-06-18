function Expired() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body items-center gap-4 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-base-200 text-base-content/60">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold">Link expired or invalid</h1>
          <p className="text-sm leading-relaxed text-base-content/70">
            This link is no longer active. It may have expired or been revoked.
          </p>
          <div className="mt-2 w-full border-t border-base-300 pt-4">
            <p className="mb-3 text-sm text-base-content/70">
              If you believe this is an error, please reach out directly:
            </p>
            <a href="mailto:cameron@cameronjim.com" className="btn btn-primary btn-block">
              Send email
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Expired
