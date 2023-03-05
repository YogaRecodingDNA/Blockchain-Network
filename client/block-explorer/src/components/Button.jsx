import className from 'classnames'

const Button = ({ 
  children,
  primary,
  secondary,
  login,
  logout,
  search,
  ...rest
}) => {
  const classes = className(rest.className, 'flex items-center px-8 py-2', {
    'rounded bg-gradient-to-r from-cyan-700 to-teal-400 hover:from-sky-400 hover:to-violet-500 text-white drop-shadow-lg': primary,
    'py-px text-xs font-normal bg-gradient-to-r from-cyan-700 to-teal-400 hover:from-sky-400 hover:to-violet-500 text-white drop-shadow-lg': secondary,
    'rounded text-emerald-400 border border-emerald-500 bg-black/70 hover:bg-emerald-800/70 hover:border-emerald-400 hover:text-emerald-400 drop-shadow-lg': login,
    'rounded text-rose-400 border border-rose-500 bg-black/70 hover:bg-rose-800/70 hover:border-rose-400 hover:text-rose-400 drop-shadow-lg': logout,
    'px-4 py-2 rounded-r-lg bg-gradient-to-r from-cyan-700 to-teal-400 hover:from-sky-400 hover:to-violet-500 text-white': search,
  });
  
  return (
    <button {...rest} className={classes} >{children}</button>
  )
}

export default Button;