export default function OvalButton({onClick, children, className}) {
  return (
    <button className={`text-white text-xl rounded-full bg-pink-400 hover:bg-pink-600 transition-colors duration-200 w-12 h-12 ${className}`} onClick={onClick}>{children}</button>
  )
}
