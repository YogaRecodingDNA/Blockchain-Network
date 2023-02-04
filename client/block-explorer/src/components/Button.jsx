import className from 'classnames'

const Button = ({ 
  children,
  primary,
  secondary,
  search,
  warning,
  danger,
  outlined,
  rounded,
  ...rest
}) => {
  const classes = className(rest.className, 'flex items-center px-8 py-2', {
    'rounded bg-gradient-to-r from-cyan-700 to-teal-400 hover:from-sky-400 hover:to-violet-500 text-white drop-shadow-lg': primary,
    'border-gray-900 bg-gray-900 text-white': secondary,
    'px-4 py-2 rounded-r-lg bg-gradient-to-r from-cyan-700 to-teal-400 hover:from-sky-400 hover:to-violet-500 text-white': search,
    'rounded-full': rounded,
    'bg-white': outlined,
    'text-blue-700': outlined && primary,
    'text-gray-900': outlined && secondary,
    'text-green': outlined && search,
    'text-yellow-400': outlined && warning,
    'text-red-500': outlined && danger
  });
  
  return (
    <button {...rest} className={classes} >{children}</button>
  )
}

export default Button;