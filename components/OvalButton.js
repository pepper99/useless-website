export default function OvalButton({onClick, children, className}) {
  return (
    <button className={`text-white sm:text-xl text-base rounded-full bg-pink-400 hover:bg-pink-600 transition-colors duration-200 sm:w-12 sm:h-12 w-8 h-8 ${className}`} onClick={onClick}>{children}</button>
  )
}
