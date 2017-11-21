<style scoped>
  .ui-admin-content {
    margin-top: 55px;
    margin-bottom: 92px;
  }

  .ui-footer {
    border-top: 1px solid rgba(0, 0, 0, .12);
    text-align: center;
    padding-top: 12px;
    padding-bottom: 12px;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
  }

  textarea {
    resize: none
  }

  .header-nav-menu i {
    color: #fff
  }
</style>
<template>
  <div class="page-brand">
    <header class="header header-brand header-waterfall ui-header">
      <ul class="nav nav-list pull-left">
        <li>
          <a href="javascript:void(0)">
            <span class="icon icon-lg">menu</span>
          </a>
        </li>
      </ul>
      <router-link class="header-logo header-affix-hide margin-left-no margin-right-no" data-offset-top="213"
                   :to="{name:'panel'}" data-spy="affix" href="javascript:void(0)">Panel Home</router-link>
      <ul class="nav nav-list pull-right">
        <li class="dropdown header-nav-menu">
          <a class="btn btn-flat btn-brand waves-attach waves-effect" href="#">
            <i class="icon icon-lg">face</i>
          </a>
        </li>
        <li>
          <a data-toggle="menu" href="#ui_menu_profile">
            <span class="access-hide">John Smith</span>
            <span class="avatar avatar-sm">
              <img alt="avatar" src="/assets/img/avatar.jpg">
            </span>
          </a>
        </li>
      </ul>
    </header>

    <nav aria-hidden="true" class="menu menu-right" id="ui_menu_profile" tabindex="-1">
      <div class="menu-scroll">
        <div class="menu-top">
          <div class="menu-top-img">
            <img alt="landscape" src="/assets/img/landscape.jpg">
          </div>
          <div class="menu-top-info">
            <a class="menu-top-user" href="javascript:void(0)">
              <span class="avatar avatar-inline margin-right">
                <img alt="avatar" src="/assets/img/avatar.jpg">
              </span>
              <span>Admin</span>
            </a>
          </div>
          <div class="menu-top-info-sub">
            <small>here nothing</small>
          </div>
        </div>
        <div class="menu-content">
          <ul class="nav">
            <li>
              <a class="waves-attach waves-effect" href="javascript:void(0)">
                Profile Settings
                <span class="menu-collapse-toggle collapsed waves-attach waves-effect"
                      data-target="#ui_menu_profile_settings" data-toggle="collapse">
								<div class="menu-collapse-toggle-close">
									<i class="icon icon-lg">close</i>
								</div>
								<div class="menu-collapse-toggle-default">
									<i class="icon icon-lg">add</i>
								</div>
							</span>
              </a>
              <ul class="menu-collapse collapse" id="ui_menu_profile_settings">
                <li>
                  <a class="waves-attach waves-effect" href="javascript:void(0)">First Item</a>
                </li>
                <li>
                  <a class="waves-attach waves-effect" href="javascript:void(0)">Another Item</a>
                </li>
                <li>
                  <a class="waves-attach waves-effect" href="javascript:void(0)">Something Else</a>
                </li>
              </ul>
            </li>
            <li>
              <a class="waves-attach waves-effect" href="javascript:void(0)">Upload Photo</a>
            </li>
            <li>
              <a class="waves-attach waves-effect" href="/admin/auth/signout">signout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="ui-admin-content">
      <router-view></router-view>
    </main>
    <footer class="footer ui-footer">
      <div class="container">
        <p>Material</p>
      </div>
    </footer>

  </div>

</template>

<script>
  export default {}
</script>
