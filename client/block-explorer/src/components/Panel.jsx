import className from 'classnames';

const Panel = ({ children, containerExplorer, fullExplorer, mobileExplorer, ...rest }) => {
  const classes = className(rest.className, {
    "w-1/2 rounded-lg bg-gray-700/40 shadow-md": fullExplorer,
    "w-full h-96 rounded-lg bg-gray-700/40 shadow-md": mobileExplorer,
    "w-full px-3 mt-20 mx-auto rounded-lg": containerExplorer,
  })

  return (
    <div {...rest} className={classes} >{children}</div>
  )
}

export default Panel;