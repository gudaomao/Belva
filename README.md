Belva
=====

Selva server

	//注释掉以下两行，
	//app.get('/', routes.index);
	//app.get('/users', user.list);
	//新加下面一行
	routes(app);


module.exports = function(app){
    app.get('/reg',function(req,res){
        res.render(reg',{});
    });
    app.post('/reg',function(req,res){
        var username = req.body.user;
        var password = req.body.pwd;
        if(username && password){
            DB.Coder_save(username,password,function(err){
                if(err){res.send(err);}
                else{res.send('');}
            });
        }
    });
});



exports.Coder_save = function(name,pwd,callback){
    coder.count({
        name:name
    },function(err,count){
        if(count==0){
            coder.insert({
                name:name,
                pwd:pwd,
                avatar:'/avatar/airplane.png'
            },{safe:true},function(err,result){
                return callback(err);
            });
        }
        else{
            return callback('user exist.');
        }
    });
}



app.post('/login',function(req,res){
    …….
    DB.Coder_login(name,pwd,function(err,doc){
        if(doc){
req.session.user = doc.name;
……
});
app.get('/',function(req,res){
    ……
if(req.session.user){
d.u = {};
d.u.name = req.session.user;}
……
});



exports.Note_save = function(doc,callback){
    notes.insert(doc,{safe:true},function(err,result){
        return callback(err);
    });
};

exports.Note_tag = function(tag,callback){
    notes.find({
        tags:tag
    },{
        limit:20
    }).toArray(function(err,docs){
        if(err){
            return callback(err);
        }
        return callback(null,docs);
    })
}



public static CefSharp.WinForms.WebView webview = null;
		public Form1()
		{
			InitializeComponent();	
			webview = new CefSharp.WinForms.WebView(“http://localhost:3000/”, new CefSharp.BrowserSettings());
			this.panel1.Controls.Add(webview);
			webview.Dock = DockStyle.Fill;
		}




[DllImport("user32.dll", EntryPoint = "ShowWindow", CharSet = CharSet.Auto)]
private static extern int ShowWindow(IntPtr hWnd, int nCmdShow);

[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern bool SetForegroundWindow(IntPtr hWnd);  
……
if (!HotKey.RegisterHotKey(Handle, 201, 0, System.Windows.Forms.Keys.F1))
{
  MessageBox.Show("全局快捷键 F1 注册失败！");
}
if (!HotKey.RegisterHotKey(Handle, 202, 0, System.Windows.Forms.Keys.F2))
{
  MessageBox.Show("全局快捷键 F2 注册失败！");
}

//重写WndProc()方法，通过监视系统消息，来调用过程
protected override void WndProc(ref Message m)//监视Windows消息
{
  const int WM_HOTKEY = 0x0312;//如果m.Msg的值为0x0312那么表示用户按下了热键
  switch (m.Msg)
  {
    case WM_HOTKEY:
      IntPtr id = m.WParam; //IntPtr用于表示指针或句柄的平台特定类型
      string sid = id.ToString();
      switch (sid)
      {
        case "201":
          Form1 np = new Form1();
          np.Show();
          ShowWindow(np.Handle, 1);
          SetForegroundWindow(np.Handle);
          break;
        case "202":
          this.Show();
          ShowWindow(this.Handle, 1);
          SetForegroundWindow(this.Handle);
          break;
        default:
          break;
      }
      break;
  }
  base.WndProc(ref m); //将系统消息传递自父类的WndProc
}



……
IndexWriter writer = new IndexWriter(@"c:/index/", new ChineseAnalyzer(), true);
try
{
	//建立索引字段
	while (myred.Read())
	{
		Document doc = new Document();
		doc.Add(Field.Keyword("id", myred["id"].ToString()));  
		//代码段的标题
doc.Add(Field.Text("title", myred["title"].ToString()));
//代码段的内容
		doc.Add(Field.Text("content", myred["content"].ToString()));
		writer.AddDocument(doc);

	}
	writer.Optimize();
	writer.Close();
}
catch (Exception e)
{
	Response.Write(e);
}
……

