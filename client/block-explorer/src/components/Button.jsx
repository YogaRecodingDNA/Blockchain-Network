import className from 'classnames'

const Button = ({ 
  children,
  primary,
  secondary,
  login,
  logout,
  search,
  submit,
  success,
  warning,
  error,
  ...rest
}) => {
  const classes = className(rest.className, 'flex items-center px-8 py-2', {
    'rounded bg-gradient-to-r from-cyan-700 to-teal-400 hover:from-sky-400 hover:to-violet-500 text-white drop-shadow-lg': primary,
    'py-px text-xs font-normal bg-gradient-to-r from-cyan-700 to-teal-400 hover:from-sky-400 hover:to-violet-500 text-white drop-shadow-lg': secondary,
    'rounded text-emerald-400 border border-emerald-500 bg-black/70 hover:bg-emerald-800/70 hover:border-emerald-400 hover:text-emerald-400 drop-shadow-lg': login,
    'rounded text-rose-400 border border-rose-500 bg-black/70 hover:bg-rose-800/70 hover:border-rose-400 hover:text-rose-400 drop-shadow-lg': logout,
    'px-4 py-2 rounded-r-lg bg-gradient-to-r from-cyan-700 to-teal-400 hover:from-sky-400 hover:to-violet-500 text-white': search,
    'group relative flex w-full justify-center rounded-md border border-indigo-600 py-2 px-4 text-sm font-medium text-white bg-gradient-to-r from-cyan-700 to-teal-400 hover:from-sky-400 hover:to-violet-500 text-white drop-shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2': submit,
    'group relative flex w-full justify-center overflow-x-auto rounded-md border border-emerald-300 py-2 px-4 text-sm font-medium text-emerald-300 bg-emerald-400/60 hover:bg-emerald-400/80 hover:text-white drop-shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2': success,
    'group relative flex w-full justify-center overflow-x-auto rounded-md border border-yellow-300 py-2 px-4 text-sm font-medium text-yellow-300 bg-yellow-400/60 hover:bg-yellow-400/80 hover:text-white drop-shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2': warning,
    'group relative flex w-full justify-center rounded-md border border-red-300 py-2 px-4 text-sm font-medium text-red-300 bg-red-400/60 hover:bg-red-400/80 hover:text-white drop-shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2': error,
  });
  
  return (
    <button {...rest} className={classes} >{children}</button>
  )
}

export default Button;