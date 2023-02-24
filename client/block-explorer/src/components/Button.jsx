import className from 'classnames'

const Button = ({ 
  children,
  primary,
  secondary,
  wallet,
  search,
  ...rest
}) => {
  const classes = className(rest.className, 'flex items-center px-8 py-2', {
    'rounded bg-gradient-to-r from-cyan-700 to-teal-400 hover:from-sky-400 hover:to-violet-500 text-white drop-shadow-lg': primary,
    'py-px text-xs font-normal bg-gradient-to-r from-cyan-700 to-teal-400 hover:from-sky-400 hover:to-violet-500 text-white drop-shadow-lg': secondary,
    'rounded text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-500 border border-gray-900/80 hover:from-gray-900 hover:via-gray-600 hover:to-gray-900 hover:border-sky-400 hover:text-sky-300 drop-shadow-lg': wallet,
    'px-4 py-2 rounded-r-lg bg-gradient-to-r from-cyan-700 to-teal-400 hover:from-sky-400 hover:to-violet-500 text-white': search,
  });
  
  return (
    <button {...rest} className={classes} >{children}</button>
  )
}

export default Button;