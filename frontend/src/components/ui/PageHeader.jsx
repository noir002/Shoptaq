const PageHeader = ({
  title,
  subtitle,
  badge,
  actions,
  meta,
}) => (
  <div className="page-header">
    <div className="page-header__main">
      {badge && <span className="page-header__badge">{badge}</span>}
      <div>
        <h2 className="page-header__title">{title}</h2>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {meta && <div className="page-header__meta hidden md:flex">{meta}</div>}
    </div>
    {actions && <div className="page-header__actions">{actions}</div>}
  </div>
);

export default PageHeader;
