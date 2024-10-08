<template>
	<div class="steps">
	  <div class="step-item">
	    <span class="step-dot"></span>
	    <div class="step-content">
	      <div class="step-title">名单</div>
	      <div class="step-desc">日期</div>
	    </div>
	    <div class="step-line"></div> <!-- 添加这一行 -->
	  </div>
		<div class="step-item">
		  <span class="step-dot"></span>
		  <div class="step-content">
		    <div class="step-title">名单</div>
		    <div class="step-desc">日期</div>
		  </div>
		  <div class="step-line"></div> <!-- 添加这一行 -->
		</div>
		<div class="step-item">
		  <span class="step-dot"></span>
		  <div class="step-content">
		    <div class="step-title">名单</div>
		    <div class="step-desc">日期</div>
		  </div>
		  <div class="step-line"></div> <!-- 添加这一行 -->
		</div>
	</div>

</template>

<style>
		.step-item {
		  position: relative;
		  display: flex;
		  align-items: flex-start;
		  margin-bottom: 10px;
		}
		
		.step-dot {
		  width: 10px;
		  height: 10px;
		  border-radius: 50%;
		  background-color: #3c9cff;
		  margin-right: 10px;
		  flex-shrink: 0; /* 防止圆点挤压内容 */
		  align-self: flex-start; /* 将圆点对齐到左上角 */
		}
		
		.step-content {
		  display: flex;
		  flex-direction: column;
		}
		
		.step-title {
		  font-weight: bold;
		  font-size: 18px;
		}
		.step-desc {
		  font-size: 16px;
		  padding-top: 4px;
		  color: #999;
		}
		
		.step-line {
		  position: absolute;
		  top: 10px; /* 根据圆点的尺寸调整 */
		  left: 4px; /* 将竖线居中对齐 */
		  bottom: -20px; /* 调整竖线的长度 */
		  width: 1px;
		  background-color: #3c9cff;
		}
		.step-item:last-child .step-line{
			display: none;
		}
	
	</style>
