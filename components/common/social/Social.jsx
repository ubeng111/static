const Social = () => {
  const socialContent = [
    { id: 1, icon: "icon-facebook", link: "#" },
    { id: 2, icon: "icon-twitter", link: "#" },
    { id: 3, icon: "icon-instagram", link: "#" },
    { id: 4, icon: "icon-linkedin", link: "#" },
  ];
  return (
    <>
      {socialContent.map((item) => (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          key={item.id}
        >
          <i className={`${item.icon} text-14`} />
        </a>
      ))}
    </>
  );
};

export default Social;
