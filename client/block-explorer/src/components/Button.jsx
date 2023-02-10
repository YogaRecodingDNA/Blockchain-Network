import className from 'classnames'

const Button = ({ 
  children,
  primary,
  secondary,
  search,
  ...rest
}) => {
  const classes = className(rest.className, 'flex items-center px-8 py-2', {
    'rounded bg-gradient-to-r from-cyan-700 to-teal-400 hover:from-sky-400 hover:to-violet-500 text-white drop-shadow-lg': primary,
    'py-px text-xs font-normal bg-gradient-to-r from-cyan-700 to-teal-400 hover:from-sky-400 hover:to-violet-500 text-white drop-shadow-lg': secondary,
    'px-4 py-2 rounded-r-lg bg-gradient-to-r from-cyan-700 to-teal-400 hover:from-sky-400 hover:to-violet-500 text-white': search,
  });
  
  return (
    <button {...rest} className={classes} >{children}</button>
  )
}

export default Button;